import { P5PhysicsRenderer } from './core/P5PhysicsRenderer.js';

class KIROApp {
  constructor() {
    this.renderer = new P5PhysicsRenderer();
    this.currentModule = null;
    this.currentConcept = null;
    this.currentLesson = null;
    this.isPlaying = false;
    this.graphData = [];
    
    this.initProgress();
    window.app = this;
  }

  initProgress() {
    this.progress = JSON.parse(localStorage.getItem('kiro_progress') || '{}');
  }

  saveProgress() {
    localStorage.setItem('kiro_progress', JSON.stringify(this.progress));
    this.updateProgressBar();
  }

  updateProgressBar() {
    const total = 9; // 3 concepts × 3 difficulties
    const completed = Object.keys(this.progress).length;
    const percent = (completed / total) * 100;
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = Math.round(percent) + '% Complete';
  }

  showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    
    // Show selected page
    const page = document.getElementById(pageId);
    if (page) {
      page.classList.add('active');
      page.style.display = pageId === 'landing' ? 'flex' : 'block';
    }
  }

  showModules() {
    this.showPage('modules');
    this.updateProgressBar();
  }

  showCustomInput() {
    this.showPage('customInput');
  }

  fillExample(text) {
    document.getElementById('customProblem').value = text;
  }

  async parseCustomProblem() {
    const problem = document.getElementById('customProblem').value.trim();
    if (!problem) {
      alert('Please enter a physics problem!');
      return;
    }

    // Show loading
    const btn = event.target;
    btn.textContent = '⏳ Parsing...';
    btn.disabled = true;

    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem })
      });

      const data = await response.json();
      
      if (data.success) {
        this.displayParsedParams(data.data);
        this.customParams = data.data;
      } else {
        alert('Failed to parse: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      btn.textContent = '🤖 Parse with AI';
      btn.disabled = false;
    }
  }

  displayParsedParams(params) {
    const output = document.getElementById('parsedOutput');
    const paramsDiv = document.getElementById('parsedParams');
    
    let html = '';
    for (const [key, value] of Object.entries(params)) {
      html += `
        <div class="param-item">
          <span class="param-label">${key}:</span>
          <span class="param-value">${value}</span>
        </div>
      `;
    }
    
    paramsDiv.innerHTML = html;
    output.style.display = 'block';
  }

  runCustomSimulation() {
    if (!this.customParams) return;
    
    // Create a custom lesson from parsed params
    const lesson = {
      id: 'custom',
      difficulty: 'custom',
      title: 'Custom Problem',
      problem: document.getElementById('customProblem').value,
      params: this.customParams,
      scenario: this.customParams.scenario || 'projectile_motion'
    };
    
    this.loadLesson(lesson);
  }

  showConcepts(module) {
    this.currentModule = module;
    this.showPage('concepts');
    
    // Update title based on module
    const titles = {
      kinematics: 'Kinematics - Motion & Velocity',
      fluid: 'Fluid Mechanics - Liquids & Gases',
      thermodynamics: 'Thermodynamics - Heat & Energy',
      electromagnetism: 'Electromagnetism - Electricity & Magnetism'
    };
    document.getElementById('conceptTitle').textContent = titles[module] || 'Physics Concepts';
    
    // Update concepts based on module
    const conceptList = document.querySelector('.concept-list');
    conceptList.innerHTML = '';
    
    const concepts = this.getConceptsForModule(module);
    concepts.forEach(concept => {
      const card = document.createElement('div');
      card.className = 'concept-card';
      card.onclick = () => this.showLessons(concept.id);
      card.innerHTML = `
        <h3>${concept.title}</h3>
        <p>${concept.description}</p>
        <div class="difficulty-badges">
          <span class="diff easy">Easy</span>
          <span class="diff medium">Medium</span>
          <span class="diff hard">Hard</span>
        </div>
      `;
      conceptList.appendChild(card);
    });
  }
  
  getConceptsForModule(module) {
    const modulesConcepts = {
      kinematics: [
        { id: 'projectile', title: 'Projectile Motion', description: 'Objects launched at angles' },
        { id: 'freefall', title: 'Free Fall', description: 'Objects falling under gravity' },
        { id: 'friction', title: 'Friction', description: 'Sliding with resistance' }
      ],
      fluid: [
        { id: 'buoyancy', title: 'Buoyancy', description: 'Objects floating in fluids' },
        { id: 'flow', title: 'Fluid Flow', description: 'Liquids in motion' },
        { id: 'pressure', title: 'Pressure', description: 'Force per unit area' }
      ],
      thermodynamics: [
        { id: 'heat_transfer', title: 'Heat Transfer', description: 'Energy flow between objects' },
        { id: 'expansion', title: 'Thermal Expansion', description: 'Materials expanding with heat' },
        { id: 'gas_laws', title: 'Gas Laws', description: 'Pressure, volume, temperature' }
      ],
      electromagnetism: [
        { id: 'electric_field', title: 'Electric Fields', description: 'Charged particle interactions' },
        { id: 'magnetic_field', title: 'Magnetic Fields', description: 'Magnetic force and motion' },
        { id: 'circuits', title: 'Circuits', description: 'Current and resistance' }
      ]
    };
    
    return modulesConcepts[module] || [];
  }

  showLessons(concept) {
    this.currentConcept = concept;
    this.showPage('lessons');
    
    // Update title based on concept
    const titles = {
      projectile: 'Projectile Motion',
      freefall: 'Free Fall',
      friction: 'Friction'
    };
    const titleElement = document.querySelector('#lessons h1');
    if (titleElement) {
      titleElement.textContent = titles[concept] || 'Lessons';
    }
    
    const lessons = this.getLessons(concept);
    const list = document.getElementById('lessonList');
    list.innerHTML = '';
    
    lessons.forEach(lesson => {
      const div = document.createElement('div');
      div.className = 'lesson-item';
      if (this.progress[lesson.id]) div.classList.add('completed');
      
      div.innerHTML = `
        <div>
          <h3>${lesson.title}</h3>
          <p>${lesson.problem}</p>
        </div>
        <span class="diff ${lesson.difficulty}">${lesson.difficulty}</span>
      `;
      div.onclick = () => this.loadLesson(lesson);
      list.appendChild(div);
    });
  }

  getLessons(concept) {
    const lessons = {
      projectile: [
        { id: 'proj_easy', difficulty: 'easy', title: 'Basic Launch', 
          problem: 'A ball is thrown at 30° with speed 15 m/s', 
          params: { velocity: 15, angle: 30 }, scenario: 'projectile_motion' },
        { id: 'proj_med', difficulty: 'medium', title: 'Optimal Angle', 
          problem: 'A ball is thrown at 45° with speed 25 m/s', 
          params: { velocity: 25, angle: 45 }, scenario: 'projectile_motion' },
        { id: 'proj_hard', difficulty: 'hard', title: 'High Velocity', 
          problem: 'A ball is thrown at 60° with speed 40 m/s', 
          params: { velocity: 40, angle: 60 }, scenario: 'projectile_motion' }
      ],
      freefall: [
        { id: 'ff_easy', difficulty: 'easy', title: 'Low Height', 
          problem: 'A ball is dropped from 20 meters', 
          params: { height: 20 }, scenario: 'free_fall' },
        { id: 'ff_med', difficulty: 'medium', title: 'Medium Height', 
          problem: 'A ball is dropped from 50 meters', 
          params: { height: 50 }, scenario: 'free_fall' },
        { id: 'ff_hard', difficulty: 'hard', title: 'High Tower', 
          problem: 'A ball is dropped from 100 meters', 
          params: { height: 100 }, scenario: 'free_fall' }
      ],
      friction: [
        { id: 'fr_easy', difficulty: 'easy', title: 'Low Friction', 
          problem: 'A 5kg block slides at 10 m/s with μ=0.2', 
          params: { mass: 5, velocity: 10, friction: 0.2 }, scenario: 'friction' },
        { id: 'fr_med', difficulty: 'medium', title: 'Medium Friction', 
          problem: 'A 10kg block slides at 20 m/s with μ=0.3', 
          params: { mass: 10, velocity: 20, friction: 0.3 }, scenario: 'friction' },
        { id: 'fr_hard', difficulty: 'hard', title: 'High Friction', 
          problem: 'A 20kg block slides at 30 m/s with μ=0.5', 
          params: { mass: 20, velocity: 30, friction: 0.5 }, scenario: 'friction' }
      ],
      buoyancy: [
        { id: 'buoy_easy', difficulty: 'easy', title: 'Simple Float', 
          problem: 'A ball floats in water', 
          params: { velocity: 10, angle: 45 }, scenario: 'projectile_motion' }
      ],
      flow: [
        { id: 'flow_easy', difficulty: 'easy', title: 'Water Flow', 
          problem: 'Water flows through a pipe', 
          params: { velocity: 15, angle: 30 }, scenario: 'projectile_motion' }
      ],
      pressure: [
        { id: 'press_easy', difficulty: 'easy', title: 'Pressure Demo', 
          problem: 'Pressure in a container', 
          params: { height: 30 }, scenario: 'free_fall' }
      ],
      heat_transfer: [
        { id: 'heat_easy', difficulty: 'easy', title: 'Heat Flow', 
          problem: 'Heat transfers between objects', 
          params: { velocity: 20, angle: 45 }, scenario: 'projectile_motion' }
      ],
      expansion: [
        { id: 'exp_easy', difficulty: 'easy', title: 'Thermal Expansion', 
          problem: 'Material expands with heat', 
          params: { height: 40 }, scenario: 'free_fall' }
      ],
      gas_laws: [
        { id: 'gas_easy', difficulty: 'easy', title: 'Gas Behavior', 
          problem: 'Gas pressure and volume', 
          params: { mass: 10, velocity: 15, friction: 0.2 }, scenario: 'friction' }
      ],
      electric_field: [
        { id: 'elec_easy', difficulty: 'easy', title: 'Electric Force', 
          problem: 'Charged particles interact', 
          params: { velocity: 25, angle: 60 }, scenario: 'projectile_motion' }
      ],
      magnetic_field: [
        { id: 'mag_easy', difficulty: 'easy', title: 'Magnetic Force', 
          problem: 'Magnetic field affects motion', 
          params: { velocity: 20, angle: 30 }, scenario: 'projectile_motion' }
      ],
      circuits: [
        { id: 'circ_easy', difficulty: 'easy', title: 'Simple Circuit', 
          problem: 'Current flows through circuit', 
          params: { height: 50 }, scenario: 'free_fall' }
      ],
      other: [
        { id: 'oth_easy', difficulty: 'easy', title: 'Simple Motion', 
          problem: 'A ball is thrown at 20° with speed 12 m/s', 
          params: { velocity: 12, angle: 20 }, scenario: 'projectile_motion' },
        { id: 'oth_med', difficulty: 'medium', title: 'Mixed Scenario', 
          problem: 'A ball is dropped from 30 meters', 
          params: { height: 30 }, scenario: 'free_fall' },
        { id: 'oth_hard', difficulty: 'hard', title: 'Complex Motion', 
          problem: 'A 15kg block slides at 25 m/s with μ=0.4', 
          params: { mass: 15, velocity: 25, friction: 0.4 }, scenario: 'friction' }
      ]
    };
    return lessons[concept] || [];
  }

  loadLesson(lesson) {
    this.currentLesson = lesson;
    this.showPage('simulation');
    
    document.getElementById('problemDisplay').textContent = lesson.problem;
    
    // Initialize p5.js renderer
    this.renderer.init('simCanvas', lesson.params, lesson.scenario);
    this.setupParameters(lesson.scenario, lesson.params);
  }

  setupParameters(scenario, params) {
    const controls = document.getElementById('paramControls');
    controls.innerHTML = '';
    
    const configs = {
      projectile_motion: [
        { name: 'velocity', label: 'Velocity (m/s)', min: 5, max: 50, value: params.velocity },
        { name: 'angle', label: 'Angle (°)', min: 0, max: 90, value: params.angle }
      ],
      free_fall: [
        { name: 'height', label: 'Height (m)', min: 10, max: 200, value: params.height }
      ],
      friction: [
        { name: 'mass', label: 'Mass (kg)', min: 1, max: 50, value: params.mass },
        { name: 'velocity', label: 'Velocity (m/s)', min: 5, max: 50, value: params.velocity },
        { name: 'friction', label: 'Friction (μ)', min: 0.1, max: 1, value: params.friction, step: 0.05 }
      ]
    };
    
    (configs[scenario] || []).forEach(param => {
      const div = document.createElement('div');
      div.className = 'param-item';
      div.innerHTML = `
        <label>${param.label}: <span id="${param.name}-val">${param.value}</span></label>
        <input type="range" id="${param.name}" min="${param.min}" max="${param.max}" 
               value="${param.value}" step="${param.step || 1}">
      `;
      controls.appendChild(div);
      
      const input = div.querySelector('input');
      input.oninput = () => {
        div.querySelector('span').textContent = input.value;
        this.updateParams();
      };
    });
  }

  updateParams() {
    const params = {};
    document.querySelectorAll('#paramControls input').forEach(input => {
      params[input.id] = parseFloat(input.value);
    });
    this.currentLesson.params = params;
    this.renderer.updateParams(params);
  }

  startSimulation() {
    this.isPlaying = true;
    this.graphData = [];
    document.getElementById('insightsList').innerHTML = '';
    document.getElementById('playPauseBtn').textContent = 'Pause';
    this.animate();
  }

  animate() {
    if (!this.isPlaying) return;
    
    this.manager.update(0.016);
    
    const canvas = document.getElementById('simCanvas');
    const ctx = canvas.getContext('2d');
    this.manager.render(ctx);
    
    this.updateInsights();
    this.updateGraph();
    document.getElementById('timeDisplay').textContent = 
      `Time: ${this.manager.currentScenario.time.toFixed(2)}s`;
    
    if (!this.manager.currentScenario.isComplete) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.isPlaying = false;
      this.markComplete();
    }
  }

  updateInsights() {
    const insights = this.manager.getInsights();
    const list = document.getElementById('insightsList');
    
    if (insights.length > list.children.length) {
      const newInsight = insights[insights.length - 1];
      const div = document.createElement('div');
      div.className = 'insight-card';
      div.innerHTML = `<strong>${newInsight.title}</strong><br>${newInsight.message}`;
      list.appendChild(div);
    }
    
    const whatIf = this.manager.getWhatIf();
    const whatIfList = document.getElementById('whatIfList');
    whatIfList.innerHTML = '';
    whatIf.forEach(w => {
      const div = document.createElement('div');
      div.className = 'whatif-card';
      div.innerHTML = `<strong>${w.question}</strong><br>${w.prediction}`;
      whatIfList.appendChild(div);
    });
  }

  updateGraph() {
    const state = this.manager.currentScenario.state;
    if (state.y !== undefined || state.height !== undefined) {
      const height = state.y || state.height;
      this.graphData.push({ time: this.manager.currentScenario.time, height });
      this.drawGraph();
    }
  }

  drawGraph() {
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, w, h);
    
    if (this.graphData.length < 2) return;
    
    const maxTime = Math.max(...this.graphData.map(d => d.time));
    const maxHeight = Math.max(...this.graphData.map(d => d.height));
    
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    this.graphData.forEach((d, i) => {
      const x = (d.time / maxTime) * (w - 40) + 20;
      const y = h - 20 - (d.height / maxHeight) * (h - 40);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.fillText('Time (s)', w - 60, h - 5);
    ctx.fillText('Height (m)', 5, 15);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    document.getElementById('playPauseBtn').textContent = this.isPlaying ? 'Pause' : 'Play';
    
    if (this.isPlaying) {
      this.renderer.play();
    } else {
      this.renderer.pause();
    }
  }

  resetSimulation() {
    this.isPlaying = false;
    this.graphData = [];
    document.getElementById('insightsList').innerHTML = '';
    document.getElementById('playPauseBtn').textContent = 'Play';
    this.renderer.reset();
  }

  markComplete() {
    this.progress[this.currentLesson.id] = true;
    this.saveProgress();
  }

  backToLessons() {
    this.showLessons(this.currentConcept);
  }

  backToSimulation() {
    this.showPage('simulation');
  }

  showTest() {
    this.showPage('test');
    this.loadQuiz();
  }

  loadQuiz() {
    const quizzes = {
      projectile: [
        { q: 'At what angle is the range maximum?', options: ['30°', '45°', '60°', '90°'], correct: 1 },
        { q: 'What happens to horizontal velocity during flight?', 
          options: ['Increases', 'Decreases', 'Remains constant', 'Becomes zero'], correct: 2 }
      ],
      freefall: [
        { q: 'What is the acceleration during free fall?', 
          options: ['0 m/s²', '9.8 m/s²', '19.6 m/s²', 'Variable'], correct: 1 },
        { q: 'How does mass affect fall time?', 
          options: ['Heavier falls faster', 'Lighter falls faster', 'No effect', 'Depends on height'], correct: 2 }
      ],
      friction: [
        { q: 'Friction force depends on:', 
          options: ['Velocity', 'Normal force', 'Time', 'Distance'], correct: 1 },
        { q: 'Higher friction coefficient means:', 
          options: ['Longer slide', 'Shorter slide', 'No change', 'Faster slide'], correct: 1 }
      ]
    };
    
    const quiz = quizzes[this.currentConcept] || [];
    const container = document.getElementById('quizContainer');
    container.innerHTML = '';
    
    quiz.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = 'quiz-question';
      div.innerHTML = `
        <h3>Question ${i + 1}: ${q.q}</h3>
        <div class="quiz-options">
          ${q.options.map((opt, j) => `
            <div class="quiz-option" data-q="${i}" data-a="${j}">${opt}</div>
          `).join('')}
        </div>
      `;
      container.appendChild(div);
    });
    
    document.querySelectorAll('.quiz-option').forEach(opt => {
      opt.onclick = () => {
        const q = opt.dataset.q;
        document.querySelectorAll(`[data-q="${q}"]`).forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      };
    });
  }

  submitTest() {
    alert('Test submitted! (Scoring system to be implemented)');
    this.backToSimulation();
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new KIROApp());
} else {
  new KIROApp();
}
