// P5.js Dynamic Physics Renderer
export class P5PhysicsRenderer {
  constructor() {
    this.sketch = null;
    this.simData = null;
    this.isRunning = false;
    this.t = 0;
    this.objects = [];
  }

  init(containerId, params, scenario) {
    this.simData = { params, scenario };
    this.t = 0;
    this.isRunning = false;
    
    // Remove existing sketch if any
    if (this.sketch) {
      this.sketch.remove();
    }

    // Create new p5 sketch
    const self = this;
    this.sketch = new p5((p) => {
      p.setup = () => {
        const canvas = p.createCanvas(600, 400);
        canvas.parent(containerId);
        canvas.style('border', '3px solid #00ff41');
        self.setupSimulation(p);
      };

      p.draw = () => {
        self.drawFrame(p);
      };
    });
  }

  setupSimulation(p) {
    this.objects = [];
    const { params, scenario } = this.simData;

    switch (scenario) {
      case 'projectile_motion':
        this.setupProjectile(p, params);
        break;
      case 'free_fall':
        this.setupFreeFall(p, params);
        break;
      case 'friction':
        this.setupFriction(p, params);
        break;
    }
  }

  setupProjectile(p, params) {
    const v0 = params.velocity || 20;
    const angle = (params.angle || 45) * Math.PI / 180;
    
    this.objects.push({
      type: 'ball',
      x: 50,
      y: 350,
      vx: v0 * Math.cos(angle),
      vy: -v0 * Math.sin(angle),
      radius: 10,
      color: [255, 100, 100],
      trail: []
    });
  }

  setupFreeFall(p, params) {
    const h0 = params.height || 50;
    const scale = 3;
    
    this.objects.push({
      type: 'ball',
      x: 300,
      y: 50,
      vx: 0,
      vy: 0,
      radius: 10,
      color: [100, 100, 255],
      initialHeight: h0,
      scale: scale
    });
  }

  setupFriction(p, params) {
    const v0 = params.velocity || 15;
    const friction = params.friction || 0.3;
    const mass = params.mass || 10;
    
    this.objects.push({
      type: 'block',
      x: 50,
      y: 330,
      vx: v0,
      vy: 0,
      width: 30,
      height: 30,
      color: [100, 255, 100],
      friction: friction,
      mass: mass
    });
  }

  drawFrame(p) {
    // Background
    p.background(15, 15, 35);
    
    // Grid
    p.stroke(0, 255, 65, 30);
    p.strokeWeight(1);
    for (let i = 0; i < p.width; i += 50) {
      p.line(i, 0, i, p.height);
    }
    for (let i = 0; i < p.height; i += 50) {
      p.line(0, i, p.width, i);
    }
    
    // Ground
    p.stroke(0, 255, 65);
    p.strokeWeight(3);
    p.line(0, 360, p.width, 360);
    
    if (!this.isRunning) {
      this.drawObjects(p);
      return;
    }

    // Update physics
    const dt = 0.016;
    this.updatePhysics(p, dt);
    
    // Draw objects
    this.drawObjects(p);
    
    // Draw info
    this.drawInfo(p);
    
    this.t += dt;
  }

  updatePhysics(p, dt) {
    const g = 9.8;
    const scale = 5;

    this.objects.forEach(obj => {
      if (obj.type === 'ball') {
        // Projectile/Free fall physics
        obj.x += obj.vx * scale * dt * 60;
        obj.y += obj.vy * scale * dt * 60;
        obj.vy += g * scale * dt * 60;

        // Trail
        if (!obj.trail) obj.trail = [];
        obj.trail.push({ x: obj.x, y: obj.y });
        if (obj.trail.length > 50) obj.trail.shift();

        // Ground collision
        if (obj.y >= 350) {
          obj.y = 350;
          obj.vy = -obj.vy * 0.6; // Bounce with energy loss
          obj.vx *= 0.9;
          
          if (Math.abs(obj.vy) < 1) {
            obj.vy = 0;
            obj.vx = 0;
          }
        }

        // Wall collision
        if (obj.x >= p.width - obj.radius || obj.x <= obj.radius) {
          obj.vx = -obj.vx * 0.8;
        }
      } else if (obj.type === 'block') {
        // Friction physics
        const frictionForce = obj.friction * g;
        const deceleration = frictionForce;
        
        if (obj.vx > 0) {
          obj.vx -= deceleration * dt * 60;
          if (obj.vx < 0) obj.vx = 0;
        }
        
        obj.x += obj.vx * scale * dt * 60;
        
        // Stop at wall
        if (obj.x >= p.width - obj.width) {
          obj.x = p.width - obj.width;
          obj.vx = 0;
        }
      }
    });
  }

  drawObjects(p) {
    this.objects.forEach(obj => {
      if (obj.type === 'ball') {
        // Draw trail
        p.noFill();
        p.stroke(obj.color[0], obj.color[1], obj.color[2], 100);
        p.strokeWeight(2);
        p.beginShape();
        obj.trail.forEach(point => {
          p.vertex(point.x, point.y);
        });
        p.endShape();

        // Draw ball
        p.fill(obj.color[0], obj.color[1], obj.color[2]);
        p.noStroke();
        p.circle(obj.x, obj.y, obj.radius * 2);
        
        // Glow effect
        p.fill(obj.color[0], obj.color[1], obj.color[2], 50);
        p.circle(obj.x, obj.y, obj.radius * 3);
      } else if (obj.type === 'block') {
        // Draw block
        p.fill(obj.color[0], obj.color[1], obj.color[2]);
        p.stroke(0, 255, 65);
        p.strokeWeight(2);
        p.rect(obj.x, obj.y, obj.width, obj.height);
        
        // Draw friction indicator
        p.fill(255, 255, 0);
        p.noStroke();
        p.textSize(10);
        p.textAlign(p.CENTER);
        p.text(`μ=${obj.friction}`, obj.x + obj.width/2, obj.y + obj.height + 15);
      }
    });
  }

  drawInfo(p) {
    p.fill(0, 255, 65);
    p.noStroke();
    p.textSize(12);
    p.textAlign(p.LEFT);
    p.text(`Time: ${this.t.toFixed(2)}s`, 10, 20);
    
    if (this.objects[0]) {
      const obj = this.objects[0];
      const height = (360 - obj.y) / 5;
      p.text(`Height: ${Math.max(0, height).toFixed(1)}m`, 10, 40);
      
      if (obj.vx !== undefined) {
        const speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy) / 5;
        p.text(`Speed: ${speed.toFixed(1)}m/s`, 10, 60);
      }
    }
  }

  play() {
    this.isRunning = true;
  }

  pause() {
    this.isRunning = false;
  }

  reset() {
    this.t = 0;
    this.isRunning = false;
    if (this.sketch) {
      this.setupSimulation(this.sketch);
    }
  }

  updateParams(params) {
    this.simData.params = params;
    this.reset();
  }

  destroy() {
    if (this.sketch) {
      this.sketch.remove();
      this.sketch = null;
    }
  }
}
