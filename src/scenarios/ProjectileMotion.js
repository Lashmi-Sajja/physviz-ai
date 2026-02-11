import { BaseScenario } from '../core/BaseScenario.js';

export class ProjectileMotion extends BaseScenario {
  static id = 'projectile_motion';
  static name = 'Projectile Motion';
  static keywords = ['thrown at', 'launched', 'angle', 'projectile', 'degrees'];

  static matches(text) {
    return this.keywords.some(kw => text.toLowerCase().includes(kw));
  }

  static create(params) {
    return new ProjectileMotion(params);
  }

  constructor(params) {
    super(params);
    this.g = 9.8;
    this.v0 = params.velocity || 20;
    this.angle = params.angle || 45;
    this.angleRad = (this.angle * Math.PI) / 180;
    this.vx = this.v0 * Math.cos(this.angleRad);
    this.vy = this.v0 * Math.sin(this.angleRad);
    this.maxHeight = (this.vy * this.vy) / (2 * this.g);
    this.range = (this.v0 * this.v0 * Math.sin(2 * this.angleRad)) / this.g;
    this.flightTime = (2 * this.vy) / this.g;
  }

  calculateState() {
    const t = this.time;
    this.state = {
      x: this.vx * t,
      y: this.vy * t - 0.5 * this.g * t * t,
      vx: this.vx,
      vy: this.vy - this.g * t,
      speed: Math.sqrt(this.vx * this.vx + Math.pow(this.vy - this.g * t, 2)),
      phase: this.getPhase()
    };

    if (this.state.y < 0) {
      this.state.y = 0;
      this.isComplete = true;
    }
  }

  getPhase() {
    const peakTime = this.vy / this.g;
    if (this.time < peakTime) return 'ascending';
    if (this.time < this.flightTime) return 'descending';
    return 'landed';
  }

  render(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const scale = Math.min(width / (this.range + 20), (height - 100) / (this.maxHeight + 10));
    const groundY = height - 60;

    // Ground
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, groundY, width, 60);

    // Trajectory path
    ctx.strokeStyle = '#60a5fa50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= this.flightTime; i += 0.05) {
      const x = 50 + this.vx * i * scale;
      const y = groundY - (this.vy * i - 0.5 * this.g * i * i) * scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Max height line
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([5, 5]);
    const maxHeightY = groundY - this.maxHeight * scale;
    ctx.beginPath();
    ctx.moveTo(0, maxHeightY);
    ctx.lineTo(width, maxHeightY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Range marker
    const rangeX = 50 + this.range * scale;
    ctx.strokeStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(rangeX, groundY - 40);
    ctx.lineTo(rangeX, groundY);
    ctx.stroke();

    // Ball
    const ballX = 50 + this.state.x * scale;
    const ballY = groundY - this.state.y * scale;
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Velocity vector
    const vScale = 3;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ballX, ballY);
    ctx.lineTo(ballX + this.state.vx * vScale, ballY - this.state.vy * vScale);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`Time: ${this.time.toFixed(2)}s`, 10, 20);
    ctx.fillText(`Height: ${this.state.y.toFixed(1)}m`, 10, 40);
    ctx.fillText(`Distance: ${this.state.x.toFixed(1)}m`, 10, 60);
    ctx.fillText(`Max: ${this.maxHeight.toFixed(1)}m`, 10, maxHeightY - 5);
    ctx.fillText(`Range: ${this.range.toFixed(1)}m`, rangeX + 5, groundY - 20);
  }

  checkInsights() {
    if (this.state.phase === 'ascending' && this.insights.length === 0) {
      this.insights.push({
        type: 'concept',
        title: 'Parabolic Path',
        message: 'Projectile follows a parabola due to constant horizontal velocity and vertical acceleration.'
      });
    }

    if (this.state.phase === 'descending' && this.insights.length === 1) {
      this.insights.push({
        type: 'observation',
        title: 'Peak Reached',
        message: `Maximum height: ${this.maxHeight.toFixed(1)}m. Vertical velocity is zero at peak.`
      });
    }

    if (this.isComplete && this.insights.length === 2) {
      this.insights.push({
        type: 'discovery',
        title: 'Landing',
        message: `Range: ${this.range.toFixed(1)}m. Flight time: ${this.flightTime.toFixed(2)}s`
      });
    }
  }

  getWhatIf() {
    return [
      {
        question: 'What if angle = 45°?',
        prediction: `Maximum range: ${((this.v0 * this.v0) / this.g).toFixed(1)}m`
      },
      {
        question: 'What if velocity doubles?',
        prediction: 'Range increases 4x (quadratic relationship)'
      }
    ];
  }
}
