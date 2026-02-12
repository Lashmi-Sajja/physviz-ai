import { BaseScenario } from '../core/BaseScenario.js';

export class InclinedPlane extends BaseScenario {
  constructor(params) {
    super(params);
    this.g = 9.8;
    this.mass = params.mass || 5;
    this.angle = params.angle || 30;
    this.friction = params.friction || 0.2;
    this.planeLength = params.planeLength || 10;
    
    this.angleRad = (this.angle * Math.PI) / 180;
    this.a = this.g * (Math.sin(this.angleRad) - this.friction * Math.cos(this.angleRad));
    this.state = { x: 0, v: 0 };
  }

  calculateState() {
    if (this.isComplete) return;
    
    this.state.v = this.a * this.time;
    this.state.x = 0.5 * this.a * this.time * this.time;
    
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
    
    // Draw object
    const scale = 400 / this.planeLength;
    const objX = planeStartX + this.state.x * scale * Math.cos(this.angleRad);
    const objY = planeStartY - this.state.x * scale * Math.sin(this.angleRad);
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(objX - 15, objY - 15, 30, 30);
    
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
  }

  checkInsights() {
    if (this.time > 0.5 && this.insights.length === 0) {
      this.insights.push(`Object accelerates at ${this.a.toFixed(2)} m/s² down the ${this.angle}° incline`);
    }
    if (this.state.x > this.planeLength / 2 && this.insights.length === 1) {
      this.insights.push(`Friction coefficient ${this.friction} reduces acceleration by ${(this.friction * this.g * Math.cos(this.angleRad)).toFixed(2)} m/s²`);
    }
  }

  getWhatIf() {
    const noFriction = this.g * Math.sin(this.angleRad);
    const steeper = this.g * (Math.sin((this.angle + 15) * Math.PI / 180) - this.friction * Math.cos((this.angle + 15) * Math.PI / 180));
    
    return [
      `Without friction: a = ${noFriction.toFixed(2)} m/s²`,
      `At ${this.angle + 15}° angle: a = ${steeper.toFixed(2)} m/s²`
    ];
  }

  static getMetadata() {
    return {
      id: 'inclined-plane',
      name: 'Inclined Plane',
      description: 'Object sliding down a slope with friction',
      icon: '📐',
      category: '2D Motion',
      parameters: [
        { name: 'mass', label: 'Mass (kg)', min: 1, max: 20, default: 5 },
        { name: 'angle', label: 'Angle (°)', min: 10, max: 60, default: 30 },
        { name: 'friction', label: 'Friction Coefficient', min: 0, max: 0.8, default: 0.2, step: 0.05 },
        { name: 'planeLength', label: 'Plane Length (m)', min: 5, max: 20, default: 10 }
      ]
    };
  }
}
