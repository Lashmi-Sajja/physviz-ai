import { BaseScenario } from '../core/BaseScenario.js';

export class CircularMotion extends BaseScenario {
  constructor(params) {
    super(params);
    this.radius = params.radius || 5;
    this.angularVelocity = params.angularVelocity || 1;
    this.mass = params.mass || 2;
    
    this.state = { angle: 0, x: this.radius, y: 0 };
  }

  calculateState() {
    this.state.angle = this.angularVelocity * this.time;
    this.state.x = this.radius * Math.cos(this.state.angle);
    this.state.y = this.radius * Math.sin(this.state.angle);
  }

  render(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 30;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw circular path
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius * scale, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw center
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw object
    const objX = centerX + this.state.x * scale;
    const objY = centerY + this.state.y * scale;
    
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(objX, objY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw velocity vector (tangent)
    const v = this.radius * this.angularVelocity;
    const vx = -this.state.y;
    const vy = this.state.x;
    const vMag = Math.sqrt(vx * vx + vy * vy);
    
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(objX + (vx / vMag) * 40, objY + (vy / vMag) * 40);
    ctx.stroke();
    
    // Draw centripetal acceleration vector (toward center)
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(objX - this.state.x * 0.3 * scale, objY - this.state.y * 0.3 * scale);
    ctx.stroke();
    
    // Display info
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    const period = (2 * Math.PI) / this.angularVelocity;
    const ac = this.radius * this.angularVelocity * this.angularVelocity;
    const fc = this.mass * ac;
    
    ctx.fillText(`Linear Velocity: ${v.toFixed(2)} m/s`, 20, 30);
    ctx.fillText(`Angular Velocity: ${this.angularVelocity.toFixed(2)} rad/s`, 20, 55);
    ctx.fillText(`Period: ${period.toFixed(2)} s`, 20, 80);
    ctx.fillText(`Centripetal Acc: ${ac.toFixed(2)} m/s²`, 20, 105);
    ctx.fillText(`Centripetal Force: ${fc.toFixed(2)} N`, 20, 130);
    
    // Legend
    ctx.font = '14px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('→ Velocity', width - 120, 30);
    ctx.fillStyle = '#ef4444';
    ctx.fillText('→ Acceleration', width - 150, 55);
  }

  checkInsights() {
    if (this.time > 1 && this.insights.length === 0) {
      const v = this.radius * this.angularVelocity;
      this.insights.push(`Object moves at constant speed ${v.toFixed(2)} m/s in circular path`);
    }
    if (this.time > 3 && this.insights.length === 1) {
      const ac = this.radius * this.angularVelocity * this.angularVelocity;
      this.insights.push(`Centripetal acceleration ${ac.toFixed(2)} m/s² always points toward center`);
    }
  }

  getWhatIf() {
    const doubleOmega = this.radius * (this.angularVelocity * 2) * (this.angularVelocity * 2);
    const doubleRadius = (this.radius * 2) * this.angularVelocity * this.angularVelocity;
    
    return [
      `If angular velocity doubles: ac = ${doubleOmega.toFixed(2)} m/s² (4x increase)`,
      `If radius doubles: ac = ${doubleRadius.toFixed(2)} m/s² (2x increase)`
    ];
  }

  static getMetadata() {
    return {
      id: 'circular-motion',
      name: 'Circular Motion',
      description: 'Uniform circular motion with centripetal force',
      icon: '🔄',
      category: 'Circular Motion',
      parameters: [
        { name: 'radius', label: 'Radius (m)', min: 1, max: 10, default: 5 },
        { name: 'angularVelocity', label: 'Angular Velocity (rad/s)', min: 0.5, max: 3, default: 1, step: 0.1 },
        { name: 'mass', label: 'Mass (kg)', min: 0.5, max: 10, default: 2, step: 0.5 }
      ]
    };
  }
}
