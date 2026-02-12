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
      case 'vertical_projectile':
        params.angle = 90;
        this.setupProjectile(p, params);
        break;
      case 'projectile_motion':
        this.setupProjectile(p, params);
        break;
      case 'free_fall':
        this.setupFreeFall(p, params);
        break;
      case 'friction':
        this.setupFriction(p, params);
        break;
      case 'relative_velocity':
        this.setupRelativeVelocity(p, params);
        break;
    }
  }

  setupProjectile(p, params) {
    const v0 = params.velocity || 20;
    const angle = (params.angle || 45) * Math.PI / 180;
    const g = 9.8;
    
    // Calculate trajectory parameters
    const vx = v0 * Math.cos(angle);
    const vy = v0 * Math.sin(angle);
    const maxHeight = (vy * vy) / (2 * g);
    const range = (v0 * v0 * Math.sin(2 * angle)) / g;
    const flightTime = (2 * vy) / g;
    
    this.objects.push({
      type: 'projectile',
      x0: 50,
      y0: 350,
      x: 50,
      y: 350,
      vx: vx,
      vy: vy,
      v0: v0,
      angle: angle,
      radius: 10,
      color: [255, 100, 100],
      trail: [],
      maxHeight: maxHeight,
      range: range,
      flightTime: flightTime
    });
  }

  setupFreeFall(p, params) {
    const h0 = params.height || 50;
    const scale = 5; // pixels per meter
    const startY = 350 - (h0 * scale); // Calculate starting y position from height
    
    this.objects.push({
      type: 'ball',
      x: 300,
      y: startY,
      vx: 0,
      vy: 0,
      radius: 10,
      color: [100, 100, 255],
      initialHeight: h0,
      trail: []
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

  setupRelativeVelocity(p, params) {
    const obj_vel = params.object_velocity || { speed: 4, angle: 0 };
    const med_vel = params.medium_velocity || { speed: 3, angle: 90 };

    const obj_angle_rad = obj_vel.angle * Math.PI / 180;
    const med_angle_rad = med_vel.angle * Math.PI / 180;

    const obj_vx = obj_vel.speed * Math.cos(obj_angle_rad);
    const obj_vy = obj_vel.speed * Math.sin(obj_angle_rad);

    const med_vx = med_vel.speed * Math.cos(med_angle_rad);
    const med_vy = med_vel.speed * Math.sin(med_angle_rad);

    const resultant_vx = obj_vx + med_vx;
    const resultant_vy = obj_vy + med_vy;

    this.objects.push({
      type: 'boat',
      x: 50,
      y: 200,
      vx: resultant_vx,
      vy: resultant_vy,
      radius: 10,
      color: [255, 255, 100],
      trail: [],
      object_velocity: {x: obj_vx, y: obj_vy, speed: obj_vel.speed, angle: obj_vel.angle},
      medium_velocity: {x: med_vx, y: med_vy, speed: med_vel.speed, angle: med_vel.angle}
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

    this.objects.forEach(obj => {
      if (obj.type === 'projectile') {
        // Use kinematic equations for accurate trajectory
        const t = this.t;
        const scale = 5; // pixels per meter
        
        // Calculate position using kinematic equations
        const x_meters = obj.vx * t;
        const y_meters = obj.vy * t - 0.5 * g * t * t;
        
        obj.x = obj.x0 + x_meters * scale;
        obj.y = obj.y0 - y_meters * scale; // Subtract because canvas y increases downward
        
        // Trail
        if (!obj.trail) obj.trail = [];
        obj.trail.push({ x: obj.x, y: obj.y });
        if (obj.trail.length > 100) obj.trail.shift();
        
        // Ground collision
        if (obj.y >= obj.y0) {
          obj.y = obj.y0;
          this.isRunning = false; // Stop when hits ground
        }
        
      } else if (obj.type === 'ball') {
        // Free fall physics
        const scale = 5;
        obj.vy += g * dt;
        obj.y += obj.vy * scale * dt;
        
        // Trail
        if (!obj.trail) obj.trail = [];
        obj.trail.push({ x: obj.x, y: obj.y });
        if (obj.trail.length > 50) obj.trail.shift();
        
        // Ground collision
        if (obj.y >= 350) {
          obj.y = 350;
          obj.vy = 0;
          this.isRunning = false;
        }
        
      } else if (obj.type === 'block') {
        // Friction physics
        const frictionForce = obj.friction * g;
        const deceleration = frictionForce;
        const scale = 5;
        
        if (obj.vx > 0) {
          obj.vx -= deceleration * dt;
          if (obj.vx < 0) obj.vx = 0;
        }
        
        obj.x += obj.vx * scale * dt;
        
        // Stop at wall
        if (obj.x >= p.width - obj.width) {
          obj.x = p.width - obj.width;
          obj.vx = 0;
          this.isRunning = false;
        }
        
        if (obj.vx === 0) {
          this.isRunning = false;
        }
      } else if (obj.type === 'boat') {
        const scale = 5;
        obj.x += obj.vx * scale * dt;
        obj.y += obj.vy * scale * dt;

        // Trail
        if (!obj.trail) obj.trail = [];
        obj.trail.push({ x: obj.x, y: obj.y });
        if (obj.trail.length > 100) obj.trail.shift();

        // Stop if it goes off screen
        if (obj.x > p.width || obj.y > p.height || obj.x < 0 || obj.y < 0) {
          this.isRunning = false;
        }
      }
    });
  }

  drawObjects(p) {
    this.objects.forEach(obj => {
      if (obj.type === 'projectile') {
        // Draw full trajectory path
        if (obj.range && obj.maxHeight) {
          const scale = 5;
          p.stroke(255, 100, 100, 50);
          p.strokeWeight(2);
          p.noFill();
          p.beginShape();
          
          for (let t = 0; t <= obj.flightTime; t += 0.05) {
            const x_m = obj.vx * t;
            const y_m = obj.vy * t - 0.5 * 9.8 * t * t;
            const px = obj.x0 + x_m * scale;
            const py = obj.y0 - y_m * scale;
            p.vertex(px, py);
          }
          p.endShape();
        }
        
        // Draw trail
        p.noFill();
        p.stroke(obj.color[0], obj.color[1], obj.color[2], 150);
        p.strokeWeight(3);
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
        
      } else if (obj.type === 'ball') {
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
      } else if (obj.type === 'boat') {
        // Draw trail
        p.noFill();
        p.stroke(obj.color[0], obj.color[1], obj.color[2], 150);
        p.strokeWeight(3);
        p.beginShape();
        obj.trail.forEach(point => {
          p.vertex(point.x, point.y);
        });
        p.endShape();

        // Draw boat
        p.fill(obj.color[0], obj.color[1], obj.color[2]);
        p.noStroke();
        p.circle(obj.x, obj.y, obj.radius * 2);

        // Draw velocity vectors
        const scale = 10;
        // Object velocity
        p.stroke(0, 255, 0);
        p.line(obj.x, obj.y, obj.x + obj.object_velocity.x * scale, obj.y + obj.object_velocity.y * scale);
        // Medium velocity
        p.stroke(0, 0, 255);
        p.line(obj.x, obj.y, obj.x + obj.medium_velocity.x * scale, obj.y + obj.medium_velocity.y * scale);
        // Resultant velocity
        p.stroke(255, 0, 0);
        p.line(obj.x, obj.y, obj.x + obj.vx * scale, obj.y + obj.vy * scale);
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
      
      if (obj.type === 'projectile') {
        const height = (obj.y0 - obj.y) / 5;
        const distance = (obj.x - obj.x0) / 5;
        p.text(`Height: ${Math.max(0, height).toFixed(1)}m`, 10, 40);
        p.text(`Distance: ${distance.toFixed(1)}m`, 10, 60);
        p.text(`Max Height: ${obj.maxHeight.toFixed(1)}m`, 10, 80);
        p.text(`Range: ${obj.range.toFixed(1)}m`, 10, 100);
      } else if (obj.type === 'ball') {
        const height = (360 - obj.y) / 5;
        p.text(`Height: ${Math.max(0, height).toFixed(1)}m`, 10, 40);
        p.text(`Velocity: ${obj.vy.toFixed(1)}m/s`, 10, 60);
      } else if (obj.type === 'block') {
        const distance = (obj.x - 50) / 5;
        p.text(`Distance: ${distance.toFixed(1)}m`, 10, 40);
        p.text(`Velocity: ${obj.vx.toFixed(1)}m/s`, 10, 60);
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

  getCurrentHeight() {
    if (this.objects[0]) {
      const obj = this.objects[0];
      if (obj.type === 'projectile') {
        return Math.max(0, (obj.y0 - obj.y) / 5);
      } else if (obj.type === 'ball') {
        return Math.max(0, (360 - obj.y) / 5);
      }
    }
    return 0;
  }

  getTime() {
    return this.t;
  }
}
