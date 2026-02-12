import { BaseScenario } from '../core/BaseScenario.js';

export class RiverCrossing extends BaseScenario {
  constructor(params) {
    super(params);
    this.boatSpeed = params.boatSpeed || 3;
    this.riverSpeed = params.riverSpeed || 2;
    this.angle = params.angle || 90;
    this.riverWidth = params.riverWidth || 100;
    
    this.angleRad = (this.angle * Math.PI) / 180;
    this.vx = this.riverSpeed + this.boatSpeed * Math.cos(this.angleRad);
    this.vy = this.boatSpeed * Math.sin(this.angleRad);
    
    this.state = { x: 0, y: 0 };
  }

  calculateState() {
    if (this.isComplete) return;
    
    this.state.x = this.vx * this.time;
    this.state.y = this.vy * this.time;
    
    if (this.state.y >= this.riverWidth) {
      this.state.y = this.riverWidth;
      this.isComplete = true;
    }
  }

  render(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw river
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(0, 100, width, 400);
    
    // Draw river flow lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const offset = ((this.time * 50) % 100);
      ctx.beginPath();
      ctx.moveTo(offset + i * 100, 100);
      ctx.lineTo(offset + i * 100 + 50, 150);
      ctx.moveTo(offset + i * 100, 200);
      ctx.lineTo(offset + i * 100 + 50, 250);
      ctx.moveTo(offset + i * 100, 300);
      ctx.lineTo(offset + i * 100 + 50, 350);
      ctx.moveTo(offset + i * 100, 400);
      ctx.lineTo(offset + i * 100 + 50, 450);
      ctx.stroke();
    }
    
    // Draw banks
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 0, width, 100);
    ctx.fillRect(0, 500, width, 100);
    
    // Draw boat
    const scale = 400 / this.riverWidth;
    const boatX = 50 + this.state.x * 3;
    const boatY = 100 + this.state.y * scale;
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(boatX, boatY - 15);
    ctx.lineTo(boatX - 10, boatY + 15);
    ctx.lineTo(boatX + 10, boatY + 15);
    ctx.closePath();
    ctx.fill();
    
    // Draw velocity vectors
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(boatX, boatY);
    ctx.lineTo(boatX + this.vx * 15, boatY);
    ctx.stroke();
    
    ctx.strokeStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(boatX, boatY);
    ctx.lineTo(boatX, boatY + this.vy * 15);
    ctx.stroke();
    
    // Display info
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(`Downstream: ${this.state.x.toFixed(1)} m`, 20, 30);
    ctx.fillText(`Across River: ${this.state.y.toFixed(1)} m`, 20, 55);
    ctx.fillText(`Resultant Speed: ${Math.sqrt(this.vx * this.vx + this.vy * this.vy).toFixed(2)} m/s`, 20, 80);
    
    // Legend
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('→ River Current', width - 180, 30);
    ctx.fillStyle = '#a855f7';
    ctx.fillText('↑ Boat Velocity', width - 180, 55);
  }

  checkInsights() {
    if (this.time > 1 && this.insights.length === 0) {
      const drift = this.state.x;
      this.insights.push(`Boat drifts ${drift.toFixed(1)} m downstream due to river current`);
    }
    if (this.state.y > this.riverWidth / 2 && this.insights.length === 1) {
      const resultant = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      this.insights.push(`Resultant velocity: ${resultant.toFixed(2)} m/s at ${(Math.atan2(this.vy, this.vx) * 180 / Math.PI).toFixed(1)}°`);
    }
  }

  getWhatIf() {
    const perpAngle = 90 - Math.atan(this.riverSpeed / this.boatSpeed) * 180 / Math.PI;
    const timeToCross = this.riverWidth / this.vy;
    const totalDrift = this.vx * timeToCross;
    
    return [
      `Total drift when crossing: ${totalDrift.toFixed(1)} m`,
      `To go straight across, aim at ${perpAngle.toFixed(1)}° upstream`
    ];
  }

  static getMetadata() {
    return {
      id: 'river-crossing',
      name: 'River Crossing',
      description: 'Boat crossing a river with current (relative velocity)',
      icon: '🚤',
      category: '2D Motion',
      parameters: [
        { name: 'boatSpeed', label: 'Boat Speed (m/s)', min: 1, max: 10, default: 3 },
        { name: 'riverSpeed', label: 'River Current (m/s)', min: 0.5, max: 5, default: 2, step: 0.5 },
        { name: 'angle', label: 'Boat Angle (°)', min: 45, max: 135, default: 90 },
        { name: 'riverWidth', label: 'River Width (m)', min: 50, max: 200, default: 100 }
      ]
    };
  }
}
