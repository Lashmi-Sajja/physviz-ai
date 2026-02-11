import { BaseScenario } from '../core/BaseScenario.js';

export class FreeFall extends BaseScenario {
  static id = 'free_fall';
  static name = 'Free Fall';
  static keywords = ['dropped', 'falls', 'free fall', 'released from'];

  static matches(text) {
    return this.keywords.some(kw => text.toLowerCase().includes(kw));
  }

  static create(params) {
    return new FreeFall(params);
  }

  constructor(params) {
    super(params);
    this.g = 9.8;
    this.h0 = params.height || 50;
    this.fallTime = Math.sqrt((2 * this.h0) / this.g);
    this.finalVelocity = this.g * this.fallTime;
  }

  calculateState() {
    const t = this.time;
    const h = this.h0 - 0.5 * this.g * t * t;
    
    this.state = {
      height: Math.max(0, h),
      velocity: this.g * t,
      acceleration: this.g,
      distance_fallen: this.h0 - Math.max(0, h),
      phase: h > 0 ? 'falling' : 'landed'
    };

    if (h <= 0) {
      this.isComplete = true;
    }
  }

  render(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const scale = (height - 120) / (this.h0 + 5);
    const groundY = height - 60;
    const centerX = width / 2;

    // Ground
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, groundY, width, 60);

    // Starting height marker
    const startY = groundY - this.h0 * scale;
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX - 100, startY);
    ctx.lineTo(centerX + 100, startY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Height scale
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    for (let i = 0; i <= this.h0; i += 10) {
      const y = groundY - i * scale;
      ctx.fillText(`${i}m`, centerX - 150, y + 4);
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(centerX - 140, y);
      ctx.lineTo(centerX - 130, y);
      ctx.stroke();
    }

    // Ball
    const ballY = groundY - this.state.height * scale;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, ballY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Velocity arrow
    if (this.state.velocity > 0.5) {
      const arrowLength = Math.min(this.state.velocity * 5, 100);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, ballY);
      ctx.lineTo(centerX, ballY + arrowLength);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(centerX, ballY + arrowLength);
      ctx.lineTo(centerX - 5, ballY + arrowLength - 10);
      ctx.lineTo(centerX + 5, ballY + arrowLength - 10);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.font = '11px monospace';
      ctx.fillText(`v=${this.state.velocity.toFixed(1)} m/s`, centerX + 25, ballY + arrowLength / 2);
    }

    // Info panel
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(10, 10, 200, 100);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`Time: ${this.time.toFixed(2)}s`, 20, 30);
    ctx.fillText(`Height: ${this.state.height.toFixed(1)}m`, 20, 50);
    ctx.fillText(`Velocity: ${this.state.velocity.toFixed(1)} m/s`, 20, 70);
    ctx.fillText(`Fallen: ${this.state.distance_fallen.toFixed(1)}m`, 20, 90);
  }

  checkInsights() {
    if (this.time > 0.5 && this.insights.length === 0) {
      this.insights.push({
        type: 'concept',
        title: 'Constant Acceleration',
        message: 'Acceleration is constant at 9.8 m/s² (gravity). Velocity increases linearly.'
      });
    }

    if (this.time > this.fallTime / 2 && this.insights.length === 1) {
      this.insights.push({
        type: 'observation',
        title: 'Velocity Increases',
        message: 'Velocity increases linearly with time: v = gt'
      });
    }

    if (this.isComplete && this.insights.length === 2) {
      this.insights.push({
        type: 'discovery',
        title: 'Impact',
        message: `Final velocity: ${this.finalVelocity.toFixed(1)} m/s. Verify: v² = 2gh`
      });
    }
  }

  getWhatIf() {
    return [
      {
        question: 'What if height doubles?',
        prediction: `Fall time increases by √2. New time: ${(this.fallTime * Math.sqrt(2)).toFixed(2)}s`
      },
      {
        question: 'What if on Moon (g=1.6)?',
        prediction: `Fall time: ${Math.sqrt((2 * this.h0) / 1.6).toFixed(2)}s (much slower!)`
      }
    ];
  }
}
