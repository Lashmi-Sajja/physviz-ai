import { ScenarioManager } from './core/ScenarioManager.js';
import { ProjectileMotion } from './scenarios/ProjectileMotion.js';
import { FreeFall } from './scenarios/FreeFall.js';
import { Friction } from './scenarios/Friction.js';

class KIROApp {
  constructor() {
    this.manager = new ScenarioManager();
    this.currentModule = null;
    this.currentConcept = null;
    this.currentLesson = null;
    this.isPlaying = false;
    this.graphData = [];
    
    this.registerScenarios();
    this.initProgress();
    window.app = this;
  }

  registerScenarios() {
    this.manager.register(ProjectileMotion);
    this.manager.register(FreeFall);
    this.manager.register(Friction);
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
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
  }

  showModules() {
    this.showPage('modules');
    this.updateProgressBar();
  }

  showConcepts(module) {
    this.currentModule = module;
    this.showPage('concepts');
  }

  showLessons(concept) {
    this.currentConcept = concept;
    this.showPage('lessons');
    
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
      ]
    };
    return lessons[concept] || [];
  }

  loadLesson(lesson) {
    this.currentLesson = lesson;
    this.showPage('simulation');
    
    document.getElementById('problemDisplay').textContent = lesson.problem;
    
    this.manager.load(lesson.scenario, lesson.params);
    this.setupParameters(lesson.scenario, lesson.params);
    this.renderInitialState();
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
    this.manager.load(this.currentLesson.scenario, params);
    this.renderInitialState();
  }

  renderInitialState() {
    const canvas = document.getElementById('simCanvas');
    const ctx = canvas.getContext('2d');
    this.manager.currentScenario.calculateState();
    this.manager.render(ctx);
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
    if (this.isPlaying) this.animate();
  }

  resetSimulation() {
    this.isPlaying = false;
    this.graphData = [];
    this.manager.currentScenario.reset();
    document.getElementById('insightsList').innerHTML = '';
    document.getElementById('playPauseBtn').textContent = 'Play';
    this.renderInitialState();
    this.drawGraph();
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

new KIROApp();
