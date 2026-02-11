// Graph Renderer for Physics Data
export class GraphRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.data = [];
    this.maxPoints = 200;
  }

  addDataPoint(time, height) {
    this.data.push({ time, height });
    if (this.data.length > this.maxPoints) {
      this.data.shift();
    }
    this.render();
  }

  clear() {
    this.data = [];
    this.render();
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // Clear
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, w, h);
    
    if (this.data.length < 2) return;
    
    // Calculate bounds
    const maxTime = Math.max(...this.data.map(d => d.time), 1);
    const maxHeight = Math.max(...this.data.map(d => d.height), 1);
    
    const padding = 50;
    const graphW = w - 2 * padding;
    const graphH = h - 2 * padding;
    
    // Draw axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();
    
    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (graphW / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, h - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding + (graphH / 10) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }
    
    // Draw labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let i = 0; i <= 5; i++) {
      const x = padding + (graphW / 5) * i;
      const time = (maxTime / 5) * i;
      ctx.fillText(time.toFixed(1), x, h - padding + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = h - padding - (graphH / 5) * i;
      const height = (maxHeight / 5) * i;
      ctx.fillText(height.toFixed(1), padding - 10, y + 4);
    }
    
    // Axis titles
    ctx.fillStyle = '#e0e7ff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Time (s)', w / 2, h - 10);
    
    ctx.save();
    ctx.translate(15, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Height (m)', 0, 0);
    ctx.restore();
    
    // Draw data line
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    this.data.forEach((point, i) => {
      const x = padding + (point.time / maxTime) * graphW;
      const y = h - padding - (point.height / maxHeight) * graphH;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#00f5ff';
    this.data.forEach((point, i) => {
      if (i % 5 === 0) { // Draw every 5th point
        const x = padding + (point.time / maxTime) * graphW;
        const y = h - padding - (point.height / maxHeight) * graphH;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}
