import { BaseScenario } from '../core/BaseScenario.js';

export class RollingBall extends BaseScenario {
  constructor(params) {
    super(params);
    this.g = 9.8;
    this.mass = params.mass || 5;
    this.angle = params.angle || 30;
    this.radius = params.radius || 0.5;
    this.planeLength = params.planeLength || 10;
    
    this.angleRad = (this.angle * Math.PI) / 180;
    // For rolling: a = (g * sinθ) / (1 + I/mr²) where I/mr² = 2/5 for solid sphere
    this.a = (this.g * Math.sin(this.angleRad)) / (1 + 2/5);
    this.state = { x: 0, v: 0, rotation: 0 };
  }

  calculateState() {
    if (this.isComplete) return;
    
    this.state.v = this.a * this.time;
    this.state.x = 0.5 * this.a * this.time * this.time;
    this.state.rotation = this.state.x / this.radius; // θ = s/r
    
    if (this.state.x >= this.planeLength) {
      this.state.x = this.planeLength;
      this.isComplete = true;
    }
  }

  render(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw inclined plane
    const planeStartX = 100;
    const planeStartY = height - 100;
    const planeEndX = planeStartX + 400 * Math.cos(this.angleRad);
    const planeEndY = planeStartY - 400 * Math.sin(this.angleRad);
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(planeStartX, planeStartY);
    ctx.lineTo(planeEndX, planeEndY);
    ctx.stroke();
    
    // Draw ground
    ctx.beginPath();
    ctx.moveTo(0, planeStartY);
    ctx.lineTo(planeStartX, planeStartY);
    ctx.stroke();
    
    // Draw ball
    const scale = 400 / this.planeLength;
    const ballX = planeStartX + this.state.x * scale * Math.cos(this.angleRad);
    const ballY = planeStartY - this.state.x * scale * Math.sin(this.angleRad);
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw rotation indicator (line inside ball)
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ballX, ballY);
    ctx.lineTo(
      ballX + 15 * Math.cos(this.state.rotation),
      ballY + 15 * Math.sin(this.state.rotation)
    );
    ctx.stroke();
    
    // Draw angle arc
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(planeStartX, planeStartY, 50, -this.angleRad, 0);
    ctx.stroke();
    
    ctx.fillStyle = '#f59e0b';
    ctx.font = '14px Arial';
    ctx.fillText(`${this.angle}°`, planeStartX + 60, planeStartY - 10);
    
    // Display info
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Distance: ${this.state.x.toFixed(2)} m`, 20, 30);
    ctx.fillText(`Velocity: ${this.state.v.toFixed(2)} m/s`, 20, 55);
    ctx.fillText(`Acceleration: ${this.a.toFixed(2)} m/s²`, 20, 80);
    ctx.fillText(`Rotation: ${(this.state.rotation * 180 / Math.PI).toFixed(0)}°`, 20, 105);
  }

  checkInsights() {
    if (this.time > 0.5 && this.insights.length === 0) {
      this.insights.push(`Ball rolls with a = ${this.a.toFixed(2)} m/s² (slower than sliding due to rotational inertia)`);
    }
    if (this.state.x > this.planeLength / 2 && this.insights.length === 1) {
      const slidingA = this.g * Math.sin(this.angleRad);
      this.insights.push(`Rolling is ${(slidingA/this.a).toFixed(1)}x slower than sliding without friction`);
    }
  }

  getWhatIf() {
    const sliding = this.g * Math.sin(this.angleRad);
    const steeper = (this.g * Math.sin((this.angle + 15) * Math.PI / 180)) / (1 + 2/5);
    
    return [
      `If sliding (no rotation): a = ${sliding.toFixed(2)} m/s²`,
      `At ${this.angle + 15}° angle: a = ${steeper.toFixed(2)} m/s²`
    ];
  }

  static getMetadata() {
    return {
      id: 'rolling-ball',
      name: 'Rolling Ball',
      description: 'Ball rolling down a slope with rotational motion',
      icon: '⚽',
      category: '2D Motion',
      parameters: [
        { name: 'mass', label: 'Mass (kg)', min: 1, max: 20, default: 5 },
        { name: 'angle', label: 'Angle (°)', min: 10, max: 60, default: 30 },
        { name: 'radius', label: 'Radius (m)', min: 0.1, max: 1, default: 0.5, step: 0.1 },
        { name: 'planeLength', label: 'Plane Length (m)', min: 5, max: 20, default: 10 }
      ]
    };
  }
}
