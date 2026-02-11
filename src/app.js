import { ScenarioManager } from './core/ScenarioManager.js';
import { ProjectileMotion } from './scenarios/ProjectileMotion.js';
import { FreeFall } from './scenarios/FreeFall.js';
import { Friction } from './scenarios/Friction.js';

class PhysicsVizApp {
  constructor() {
    this.manager = new ScenarioManager();
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.isPlaying = false;
    this.animationId = null;
    this.selectedScenario = null;

    this.registerScenarios();
    this.setupEventListeners();
  }

  registerScenarios() {
    this.manager.register(ProjectileMotion);
    this.manager.register(FreeFall);
    this.manager.register(Friction);
  }

  setupEventListeners() {
    // Scenario selection
    document.querySelectorAll('.scenario-card:not(.disabled)').forEach(card => {
      card.addEventListener('click', (e) => {
        this.selectedScenario = card.dataset.scenario;
        this.showProblemInput();
      });
    });

    // Navigation
    document.getElementById('backBtn').addEventListener('click', () => this.showScenarioSelector());
    document.getElementById('quickStartBtn').addEventListener('click', () => this.quickStart());
    document.getElementById('parseBtn').addEventListener('click', () => this.parseWithAI());
    document.getElementById('startBtn').addEventListener('click', () => this.startSimulation());
    document.getElementById('resetBtn').addEventListener('click', () => this.resetParameters());
    document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
    document.getElementById('restartBtn').addEventListener('click', () => this.restart());
  }

  showScenarioSelector() {
    document.querySelector('.scenario-selector').style.display = 'block';
    document.querySelector('.problem-input').style.display = 'none';
    document.querySelector('.parameters').style.display = 'none';
    document.querySelector('.visualization').style.display = 'none';
    document.querySelector('.insights').style.display = 'none';
  }

  showProblemInput() {
    document.querySelector('.scenario-selector').style.display = 'none';
    document.querySelector('.problem-input').style.display = 'block';
    
    // Set example text
    const examples = {
      projectile_motion: 'A ball is thrown at 45 degrees with speed 20 m/s',
      free_fall: 'A ball is dropped from 50 meters',
      friction: 'A 10kg block slides at 20 m/s on surface with friction coefficient 0.3'
    };
    document.getElementById('problemText').value = examples[this.selectedScenario] || '';
  }

  quickStart() {
    const defaults = {
      projectile_motion: { velocity: 20, angle: 45 },
      free_fall: { height: 50 },
      friction: { mass: 10, velocity: 20, friction: 0.3 }
    };
    
    this.showParameters(defaults[this.selectedScenario]);
  }

  async parseWithAI() {
    // TODO: Implement AI parsing with backend
    alert('AI parsing will be implemented with backend integration');
    this.quickStart();
  }

  showParameters(params) {
    document.querySelector('.problem-input').style.display = 'none';
    document.querySelector('.parameters').style.display = 'block';
    
    const controlsDiv = document.getElementById('paramControls');
    controlsDiv.innerHTML = '';

    const paramConfigs = {
      projectile_motion: [
        { name: 'velocity', label: 'Initial Velocity (m/s)', min: 5, max: 50, value: params.velocity },
        { name: 'angle', label: 'Launch Angle (degrees)', min: 0, max: 90, value: params.angle }
      ],
      free_fall: [
        { name: 'height', label: 'Initial Height (m)', min: 10, max: 200, value: params.height }
      ],
      friction: [
        { name: 'mass', label: 'Mass (kg)', min: 1, max: 50, value: params.mass },
        { name: 'velocity', label: 'Initial Velocity (m/s)', min: 5, max: 50, value: params.velocity },
        { name: 'friction', label: 'Friction Coefficient (μ)', min: 0.1, max: 1, value: params.friction, step: 0.05 }
      ]
    };

    const config = paramConfigs[this.selectedScenario];
    config.forEach(param => {
      const div = document.createElement('div');
      div.className = 'param-control';
      div.innerHTML = `
        <label>${param.label}: <span class="param-value" id="${param.name}-value">${param.value}</span></label>
        <input type="range" id="${param.name}" min="${param.min}" max="${param.max}" 
               value="${param.value}" step="${param.step || 1}">
      `;
      controlsDiv.appendChild(div);

      const input = div.querySelector('input');
      const valueSpan = div.querySelector('.param-value');
      input.addEventListener('input', () => {
        valueSpan.textContent = input.value;
      });
    });

    this.currentParams = params;
  }

  startSimulation() {
    // Collect current parameter values
    const params = {};
    document.querySelectorAll('#paramControls input').forEach(input => {
      params[input.id] = parseFloat(input.value);
    });

    // Load scenario
    this.manager.load(this.selectedScenario, params);

    // Show visualization
    document.querySelector('.parameters').style.display = 'none';
    document.querySelector('.visualization').style.display = 'block';
    document.querySelector('.insights').style.display = 'block';

    this.isPlaying = true;
    this.animate();
  }

  animate() {
    if (!this.isPlaying) return;

    this.manager.update(0.016);
    this.manager.render(this.ctx);
    this.updateInsights();
    this.updateTime();

    if (!this.manager.currentScenario.isComplete) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.isPlaying = false;
      document.getElementById('playPauseBtn').textContent = '↻ Replay';
    }
  }

  updateInsights() {
    const insights = this.manager.getInsights();
    const insightsList = document.getElementById('insightsList');
    
    if (insights.length > insightsList.children.length) {
      const newInsight = insights[insights.length - 1];
      const card = document.createElement('div');
      card.className = 'insight-card';
      card.innerHTML = `
        <h4>${newInsight.title}</h4>
        <p>${newInsight.message}</p>
      `;
      insightsList.appendChild(card);
    }

    // Update what-if scenarios
    const whatIf = this.manager.getWhatIf();
    const whatIfList = document.getElementById('whatIfList');
    whatIfList.innerHTML = '';
    whatIf.forEach(scenario => {
      const card = document.createElement('div');
      card.className = 'whatif-card';
      card.innerHTML = `
        <h4>${scenario.question}</h4>
        <p>${scenario.prediction}</p>
      `;
      whatIfList.appendChild(card);
    });
  }

  updateTime() {
    const time = this.manager.currentScenario?.time || 0;
    document.getElementById('timeDisplay').textContent = `Time: ${time.toFixed(2)}s`;
  }

  togglePlayPause() {
    if (this.manager.currentScenario.isComplete) {
      this.restart();
    } else {
      this.isPlaying = !this.isPlaying;
      document.getElementById('playPauseBtn').textContent = this.isPlaying ? '⏸ Pause' : '▶ Play';
      if (this.isPlaying) this.animate();
    }
  }

  restart() {
    this.manager.currentScenario.reset();
    document.getElementById('insightsList').innerHTML = '';
    this.isPlaying = true;
    document.getElementById('playPauseBtn').textContent = '⏸ Pause';
    this.animate();
  }

  resetParameters() {
    this.showProblemInput();
  }
}

// Initialize app
new PhysicsVizApp();
