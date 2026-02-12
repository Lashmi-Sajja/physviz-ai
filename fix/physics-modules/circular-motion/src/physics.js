/**
 * Circular Motion Physics Engine
 * Handles uniform circular motion, angular velocity, and centripetal forces
 */

export class CircularMotion {
  constructor(radius, angularVelocity) {
    this.radius = radius; // meters
    this.omega = angularVelocity; // rad/s
  }

  /**
   * Get linear (tangential) velocity
   */
  getLinearVelocity() {
    return this.radius * this.omega;
  }

  /**
   * Get centripetal acceleration
   */
  getCentripetalAcceleration() {
    return this.radius * this.omega * this.omega;
  }

  /**
   * Get period (time for one complete revolution)
   */
  getPeriod() {
    if (this.omega === 0) return Infinity;
    return (2 * Math.PI) / this.omega;
  }

  /**
   * Get frequency (revolutions per second)
   */
  getFrequency() {
    return this.omega / (2 * Math.PI);
  }

  /**
   * Get centripetal force for given mass
   */
  getCentripetalForce(mass) {
    return mass * this.getCentripetalAcceleration();
  }

  /**
   * Get position at time t (starting at angle 0)
   */
  getPosition(t, initialAngle = 0) {
    const theta = initialAngle + this.omega * t;
    return {
      x: this.radius * Math.cos(theta),
      y: this.radius * Math.sin(theta),
      angle: theta
    };
  }

  /**
   * Get velocity vector at time t
   */
  getVelocityVector(t, initialAngle = 0) {
    const theta = initialAngle + this.omega * t;
    const v = this.getLinearVelocity();
    return {
      vx: -v * Math.sin(theta), // Tangent to circle
      vy: v * Math.cos(theta),
      magnitude: v
    };
  }

  /**
   * Get acceleration vector at time t (points toward center)
   */
  getAccelerationVector(t, initialAngle = 0) {
    const theta = initialAngle + this.omega * t;
    const a = this.getCentripetalAcceleration();
    return {
      ax: -a * Math.cos(theta), // Points toward center
      ay: -a * Math.sin(theta),
      magnitude: a
    };
  }

  /**
   * Get circular path points for visualization
   */
  getCircularPath(numPoints = 100) {
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
      const theta = (i / numPoints) * 2 * Math.PI;
      points.push({
        x: this.radius * Math.cos(theta),
        y: this.radius * Math.sin(theta),
        angle: theta
      });
    }
    return points;
  }

  /**
   * Get motion data over time
   */
  getMotionData(duration, numPoints = 100, initialAngle = 0) {
    const data = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * duration;
      const pos = this.getPosition(t, initialAngle);
      const vel = this.getVelocityVector(t, initialAngle);
      const acc = this.getAccelerationVector(t, initialAngle);
      
      data.push({
        t: t,
        position: pos,
        velocity: vel,
        acceleration: acc
      });
    }
    return data;
  }
}

/**
 * Banked curve analysis
 */
export class BankedCurve {
  constructor(radius, bankAngle, frictionCoefficient = 0) {
    this.radius = radius; // meters
    this.theta = bankAngle * Math.PI / 180; // Convert to radians
    this.mu = frictionCoefficient;
    this.g = 9.81; // m/s²
  }

  /**
   * Calculate ideal speed for frictionless banking
   */
  getIdealSpeed() {
    return Math.sqrt(this.g * this.radius * Math.tan(this.theta));
  }

  /**
   * Calculate maximum speed with friction
   */
  getMaximumSpeed() {
    const numerator = this.g * this.radius * (Math.sin(this.theta) + this.mu * Math.cos(this.theta));
    const denominator = Math.cos(this.theta) - this.mu * Math.sin(this.theta);
    
    if (denominator <= 0) return Infinity; // No maximum (unrealistic scenario)
    
    return Math.sqrt(numerator / denominator);
  }

  /**
   * Calculate minimum speed with friction (to not slide down)
   */
  getMinimumSpeed() {
    if (this.mu === 0) return this.getIdealSpeed();
    
    const numerator = this.g * this.radius * (Math.sin(this.theta) - this.mu * Math.cos(this.theta));
    const denominator = Math.cos(this.theta) + this.mu * Math.sin(this.theta);
    
    if (numerator <= 0) return 0; // Friction prevents sliding at any speed
    
    return Math.sqrt(numerator / denominator);
  }

  /**
   * Check if speed is safe for the curve
   */
  isSafeSpeed(speed) {
    const min = this.getMinimumSpeed();
    const max = this.getMaximumSpeed();
    return speed >= min && speed <= max;
  }
}

/**
 * Vertical circular motion (e.g., loop-the-loop)
 */
export class VerticalCircle {
  constructor(radius) {
    this.radius = radius;
    this.g = 9.81;
  }

  /**
   * Calculate minimum speed at top to maintain contact
   */
  getMinimumSpeedAtTop() {
    return Math.sqrt(this.g * this.radius);
  }

  /**
   * Calculate speed at bottom given speed at top (energy conservation)
   */
  getSpeedAtBottom(speedAtTop) {
    // Energy: 0.5*m*v_bottom² = 0.5*m*v_top² + m*g*(2*radius)
    const v2Top = speedAtTop * speedAtTop;
    const v2Bottom = v2Top + 4 * this.g * this.radius;
    return Math.sqrt(v2Bottom);
  }

  /**
   * Calculate speed at any angle (from bottom, measured from vertical)
   */
  getSpeedAtAngle(initialSpeed, angle) {
    const angleRad = angle * Math.PI / 180;
    const height = this.radius * (1 - Math.cos(angleRad));
    
    // Energy conservation
    const v2 = initialSpeed * initialSpeed - 2 * this.g * height;
    
    return v2 > 0 ? Math.sqrt(v2) : 0;
  }

  /**
   * Calculate normal force at angle (per unit mass)
   */
  getNormalForce(speed, angle, mass = 1) {
    const angleRad = angle * Math.PI / 180;
    const centripetalForce = mass * speed * speed / this.radius;
    const gravityComponent = mass * this.g * Math.cos(angleRad);
    
    // Normal force = centripetal - gravity component
    return centripetalForce - gravityComponent;
  }

  /**
   * Check if object maintains contact throughout loop
   */
  willCompleteLoop(initialSpeed) {
    const speedAtTop = this.getSpeedAtAngle(initialSpeed, 180);
    const minSpeed = this.getMinimumSpeedAtTop();
    return speedAtTop >= minSpeed;
  }
}

/**
 * Convert between angular and linear quantities
 */
export class AngularConverter {
  /**
   * Convert RPM to rad/s
   */
  static rpmToRadPerSec(rpm) {
    return rpm * 2 * Math.PI / 60;
  }

  /**
   * Convert rad/s to RPM
   */
  static radPerSecToRpm(radPerSec) {
    return radPerSec * 60 / (2 * Math.PI);
  }

  /**
   * Convert linear velocity to angular velocity
   */
  static linearToAngular(velocity, radius) {
    return velocity / radius;
  }

  /**
   * Convert angular velocity to linear velocity
   */
  static angularToLinear(omega, radius) {
    return omega * radius;
  }

  /**
   * Convert degrees to radians
   */
  static degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * Convert radians to degrees
   */
  static radToDeg(radians) {
    return radians * 180 / Math.PI;
  }
}
