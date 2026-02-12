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
      case 'inclined_plane':
        this.setupInclinedPlane(p, params);
        break;
      case 'river_crossing':
        this.setupRiverCrossing(p, params);
        break;
      case 'rolling_ball':
        this.setupRollingBall(p, params);
        break;
      case 'circular_motion':
        this.setupCircularMotion(p, params);
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

  setupInclinedPlane(p, params) {
    const mass = params.mass || 10;
    const angle = params.angle || 30;
    const friction = params.friction || 0.2;
    const planeLength = params.planeLength || 10;
    
    this.objects.push({
      type: 'inclined',
      x: 0,
      mass: mass,
      angle: angle,
      friction: friction,
      planeLength: planeLength,
      g: 9.8
    });
  }

  setupRiverCrossing(p, params) {
    const boatSpeed = params.boatSpeed || 3;
    const riverSpeed = params.riverSpeed || 2;
    const angle = params.angle || 90;
    const riverWidth = params.riverWidth || 100;
    
    this.objects.push({
      type: 'river',
      x: 0,
      y: 0,
      boatSpeed: boatSpeed,
      riverSpeed: riverSpeed,
      angle: angle,
      riverWidth: riverWidth
    });
  }

  setupRollingBall(p, params) {
    const mass = params.mass || 5;
    const angle = params.angle || 30;
    const radius = params.radius || 0.5;
    const planeLength = params.planeLength || 10;
    
    this.objects.push({
      type: 'rolling',
      x: 0,
      mass: mass,
      angle: angle,
      radius: radius,
      planeLength: planeLength,
      g: 9.8
    });
  }

  setupCircularMotion(p, params) {
    const radius = params.radius || 5;
    const angularVelocity = params.angularVelocity || 1;
    const mass = params.mass || 2;
    
    this.objects.push({
      type: 'circular',
      radius: radius,
      angularVelocity: angularVelocity,
      mass: mass,
      angle: 0
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
        
      } else if (obj.type === 'inclined') {
        const angleRad = obj.angle * Math.PI / 180;
        const a = obj.g * (Math.sin(angleRad) - obj.friction * Math.cos(angleRad));
        const x = 0.5 * a * this.t * this.t;
        const scale = 300 / obj.planeLength;
        
        // Draw plane
        p.stroke(100, 100, 100);
        p.strokeWeight(4);
        const planeStartX = 100;
        const planeStartY = 300;
        const planeEndX = planeStartX + 300 * Math.cos(angleRad);
        const planeEndY = planeStartY - 300 * Math.sin(angleRad);
        p.line(planeStartX, planeStartY, planeEndX, planeEndY);
        
        // Draw ground
        p.line(0, planeStartY, planeStartX, planeStartY);
        
        // Draw angle arc
        p.stroke(251, 191, 36);
        p.strokeWeight(2);
        p.noFill();
        p.arc(planeStartX, planeStartY, 60, 60, -angleRad, 0);
        
        // Draw angle label
        p.fill(251, 191, 36);
        p.noStroke();
        p.textSize(14);
        p.text(`${obj.angle}°`, planeStartX + 70, planeStartY - 10);
        
        // Draw block
        const blockX = planeStartX + x * scale * Math.cos(angleRad);
        const blockY = planeStartY - x * scale * Math.sin(angleRad);
        p.fill(59, 130, 246);
        p.stroke(0, 255, 65);
        p.strokeWeight(2);
        p.rect(blockX - 15, blockY - 15, 30, 30);
        
        // Display info
        p.fill(0, 255, 65);
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT);
        p.text(`Distance: ${x.toFixed(2)}m`, 10, 40);
        p.text(`Velocity: ${(a * this.t).toFixed(2)}m/s`, 10, 60);
        p.text(`Acceleration: ${a.toFixed(2)}m/s²`, 10, 80);
        p.text(`Friction: μ=${obj.friction}`, 10, 100);
        
      } else if (obj.type === 'river') {
        const angleRad = obj.angle * Math.PI / 180;
        const vx = obj.riverSpeed + obj.boatSpeed * Math.cos(angleRad);
        const vy = obj.boatSpeed * Math.sin(angleRad);
        const x = vx * this.t;
        const y = vy * this.t;
        
        // Draw river
        p.fill(59, 130, 246);
        p.noStroke();
        p.rect(0, 100, 600, 200);
        
        // Draw boat
        const scale = 200 / obj.riverWidth;
        const boatX = 50 + x * 3;
        const boatY = 100 + y * scale;
        p.fill(239, 68, 68);
        p.triangle(boatX, boatY - 15, boatX - 10, boatY + 15, boatX + 10, boatY + 15);
        
      } else if (obj.type === 'rolling') {
        const angleRad = obj.angle * Math.PI / 180;
        const a = (obj.g * Math.sin(angleRad)) / (1 + 2/5);
        const x = 0.5 * a * this.t * this.t;
        const rotation = x / obj.radius;
        const scale = 300 / obj.planeLength;
        
        // Draw plane
        p.stroke(100, 100, 100);
        p.strokeWeight(4);
        const planeStartX = 100;
        const planeStartY = 300;
        const planeEndX = planeStartX + 300 * Math.cos(angleRad);
        const planeEndY = planeStartY - 300 * Math.sin(angleRad);
        p.line(planeStartX, planeStartY, planeEndX, planeEndY);
        
        // Draw ground
        p.line(0, planeStartY, planeStartX, planeStartY);
        
        // Draw angle arc
        p.stroke(251, 191, 36);
        p.strokeWeight(2);
        p.noFill();
        p.arc(planeStartX, planeStartY, 60, 60, -angleRad, 0);
        
        // Draw angle label
        p.fill(251, 191, 36);
        p.noStroke();
        p.textSize(14);
        p.text(`${obj.angle}°`, planeStartX + 70, planeStartY - 10);
        
        // Draw ball
        const ballX = planeStartX + x * scale * Math.cos(angleRad);
        const ballY = planeStartY - x * scale * Math.sin(angleRad);
        p.fill(239, 68, 68);
        p.stroke(0, 255, 65);
        p.strokeWeight(2);
        p.circle(ballX, ballY, 30);
        
        // Rotation indicator
        p.stroke(255, 255, 255);
        p.strokeWeight(3);
        p.line(ballX, ballY, ballX + 12 * Math.cos(rotation), ballY + 12 * Math.sin(rotation));
        
        // Display info
        p.fill(0, 255, 65);
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT);
        p.text(`Distance: ${x.toFixed(2)}m`, 10, 40);
        p.text(`Velocity: ${(a * this.t).toFixed(2)}m/s`, 10, 60);
        p.text(`Acceleration: ${a.toFixed(2)}m/s²`, 10, 80);
        
      } else if (obj.type === 'circular') {
        const angle = obj.angularVelocity * this.t;
        const centerX = 300;
        const centerY = 200;
        const scale = 30;
        
        // Draw circular path
        p.stroke(100, 100, 100);
        p.strokeWeight(2);
        p.noFill();
        p.circle(centerX, centerY, obj.radius * scale * 2);
        
        // Draw center
        p.fill(255, 255, 255);
        p.noStroke();
        p.circle(centerX, centerY, 5);
        
        // Draw object
        const objX = centerX + obj.radius * scale * Math.cos(angle);
        const objY = centerY + obj.radius * scale * Math.sin(angle);
        p.fill(168, 85, 247);
        p.circle(objX, objY, 20);
        
        // Draw velocity vector
        p.stroke(251, 191, 36);
        p.strokeWeight(3);
        const vx = -Math.sin(angle);
        const vy = Math.cos(angle);
        p.line(objX, objY, objX + vx * 40, objY + vy * 40);
        
        // Draw centripetal acceleration
        p.stroke(239, 68, 68);
        const ax = -Math.cos(angle);
        const ay = -Math.sin(angle);
        p.line(objX, objY, objX + ax * 30, objY + ay * 30);
        
        // Display info
        p.fill(0, 255, 65);
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT);
        const v = obj.radius * obj.angularVelocity;
        const ac = obj.radius * obj.angularVelocity * obj.angularVelocity;
        p.text(`Linear Velocity: ${v.toFixed(2)}m/s`, 10, 40);
        p.text(`Angular Velocity: ${obj.angularVelocity.toFixed(2)}rad/s`, 10, 60);
        p.text(`Centripetal Acc: ${ac.toFixed(2)}m/s²`, 10, 80);
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
