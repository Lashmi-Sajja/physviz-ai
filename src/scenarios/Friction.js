import { BaseScenario } from '../core/BaseScenario.js';

export class Friction extends BaseScenario {
  static id = 'friction';
  static name = 'Friction';
  static keywords = ['friction', 'slides', 'rough surface', 'coefficient', 'μ'];

  static matches(text) {
    return this.keywords.some(kw => text.toLowerCase().includes(kw));
  }

  static create(params) {
    return new Friction(params);
  }

  constructor(params) {
    super(params);
    this.mass = params.mass || 10;
    this.v0 = params.velocity || 20;
    this.mu = params.friction || 0.3;
    this.g = 9.8;
    
    this.frictionForce = this.mu * this.mass * this.g;
    this.deceleration = this.mu * this.g;
    this.stopTime = this.v0 / this.deceleration;
    this.stopDistance = (this.v0 * this.v0) / (2 * this.deceleration);
  }

  calculateState() {
    const t = this.time;
    
    if (t >= this.stopTime) {
      this.state = {
        position: this.stopDistance,
        velocity: 0,
        acceleration: 0,
        friction: 0,
        phase: 'stopped'
      };
      this.isComplete = true;
    } else {
      this.state = {
        position: this.v0 * t - 0.5 * this.deceleration * t * t,
        velocity: this.v0 - this.deceleration * t,
        acceleration: -this.deceleration,
        friction: this.frictionForce,
        phase: 'sliding'
      };
    }
  }

  render(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const scale = (width - 100) / (this.stopDistance + 10);
    const groundY = height / 2;

    // Ground with texture
    ctx.fillStyle = '#78716c';
    ctx.fillRect(0, groundY, width, 100);
    
    // Rough surface pattern
    ctx.strokeStyle = '#57534e';
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, groundY);
      ctx.lineTo(i + 10, groundY + 5);
      ctx.stroke();
    }

    // Stop distance marker
    const stopX = 50 + this.stopDistance * scale;
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(stopX, groundY - 50);
    ctx.lineTo(stopX, groundY + 100);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = '12px monospace';
    ctx.fillText(`Stop: ${this.stopDistance.toFixed(1)}m`, stopX + 5, groundY - 30);

    // Block
    const blockX = 50 + this.state.position * scale;
    const blockSize = 40;
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(blockX - blockSize / 2, groundY - blockSize, blockSize, blockSize);
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.strokeRect(blockX - blockSize / 2, groundY - blockSize, blockSize, blockSize);

    // Friction force arrow
    if (this.state.velocity > 0) {
      const arrowLength = 60;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(blockX, groundY - blockSize / 2);
      ctx.lineTo(blockX - arrowLength, groundY - blockSize / 2);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(blockX - arrowLength, groundY - blockSize / 2);
      ctx.lineTo(blockX - arrowLength + 10, groundY - blockSize / 2 - 5);
      ctx.lineTo(blockX - arrowLength + 10, groundY - blockSize / 2 + 5);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px monospace';
      ctx.fillText('Friction', blockX - arrowLength - 10, groundY - blockSize / 2 - 10);
    }

    // Velocity arrow
    if (this.state.velocity > 0.5) {
      const vArrowLength = Math.min(this.state.velocity * 3, 80);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(blockX, groundY - blockSize / 2);
      ctx.lineTo(blockX + vArrowLength, groundY - blockSize / 2);
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.font = '11px monospace';
      ctx.fillText(`v=${this.state.velocity.toFixed(1)} m/s`, blockX + vArrowLength + 5, groundY - blockSize / 2);
    }

    // Info panel
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 10, 220, 120);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`Time: ${this.time.toFixed(2)}s`, 20, 30);
    ctx.fillText(`Position: ${this.state.position.toFixed(1)}m`, 20, 50);
    ctx.fillText(`Velocity: ${this.state.velocity.toFixed(1)} m/s`, 20, 70);
    ctx.fillText(`Friction: ${this.frictionForce.toFixed(1)} N`, 20, 90);
    ctx.fillText(`μ = ${this.mu}`, 20, 110);
  }

  checkInsights() {
    if (this.time > 0.5 && this.insights.length === 0) {
      this.insights.push({
        type: 'concept',
        title: 'Friction Opposes Motion',
        message: `Friction force = μ × N = ${this.mu} × ${(this.mass * this.g).toFixed(1)} = ${this.frictionForce.toFixed(1)} N`
      });
    }

    if (this.time > this.stopTime / 2 && this.insights.length === 1) {
      this.insights.push({
        type: 'observation',
        title: 'Constant Deceleration',
        message: `Deceleration = ${this.deceleration.toFixed(1)} m/s². Velocity decreases linearly.`
      });
    }

    if (this.isComplete && this.insights.length === 2) {
      this.insights.push({
        type: 'discovery',
        title: 'Stopped',
        message: `Stopped after ${this.stopDistance.toFixed(1)}m in ${this.stopTime.toFixed(2)}s. All kinetic energy dissipated.`
      });
    }
  }

  getWhatIf() {
    return [
      {
        question: 'What if μ doubles?',
        prediction: `Stop distance halves: ${(this.stopDistance / 2).toFixed(1)}m`
      },
      {
        question: 'What if velocity doubles?',
        prediction: `Stop distance increases 4x: ${(this.stopDistance * 4).toFixed(1)}m (quadratic!)`
      }
    ];
  }
}
