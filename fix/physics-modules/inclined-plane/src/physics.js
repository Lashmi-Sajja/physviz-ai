/**
 * Inclined Plane Physics Engine
 * Calculates motion on inclined surfaces with friction
 */

const GRAVITY = 9.81; // m/s²

export class InclinedPlane {
  constructor(angle, mass, frictionCoefficient = 0, length = 10) {
    this.theta = angle * Math.PI / 180; // Convert to radians
    this.mass = mass; // kg
    this.mu = frictionCoefficient; // coefficient of friction
    this.length = length; // length of incline in meters
    this.angle = angle; // degrees
  }

  /**
   * Calculate component of gravitational force along the plane
   */
  getParallelForce() {
    return this.mass * GRAVITY * Math.sin(this.theta);
  }

  /**
   * Calculate normal force (perpendicular to plane)
   */
  getNormalForce() {
    return this.mass * GRAVITY * Math.cos(this.theta);
  }

  /**
   * Calculate friction force
   */
  getFrictionForce() {
    return this.mu * this.getNormalForce();
  }

  /**
   * Calculate net force along the plane
   */
  getNetForce() {
    const parallelForce = this.getParallelForce();
    const frictionForce = this.getFrictionForce();
    return parallelForce - frictionForce;
  }

  /**
   * Calculate acceleration down the plane
   */
  getAcceleration() {
    return this.getNetForce() / this.mass;
  }

  /**
   * Check if object will slide
   */
  willSlide() {
    return Math.tan(this.theta) > this.mu;
  }

  /**
   * Calculate time to reach bottom of incline
   */
  getTimeToBottom() {
    if (!this.willSlide()) return Infinity;
    
    const a = this.getAcceleration();
    // s = 0.5 * a * t²
    // t = sqrt(2s / a)
    return Math.sqrt(2 * this.length / a);
  }

  /**
   * Calculate final velocity at bottom
   */
  getFinalVelocity() {
    if (!this.willSlide()) return 0;
    
    const a = this.getAcceleration();
    // v² = u² + 2as, where u = 0
    return Math.sqrt(2 * a * this.length);
  }

  /**
   * Calculate position at time t
   */
  getPosition(t) {
    if (!this.willSlide()) return 0;
    
    const a = this.getAcceleration();
    const s = 0.5 * a * t * t;
    return Math.min(s, this.length);
  }

  /**
   * Calculate velocity at time t
   */
  getVelocity(t) {
    if (!this.willSlide()) return 0;
    
    const a = this.getAcceleration();
    const maxTime = this.getTimeToBottom();
    const actualTime = Math.min(t, maxTime);
    return a * actualTime;
  }

  /**
   * Get motion data for visualization
   */
  getMotionData(numPoints = 100) {
    const points = [];
    
    if (!this.willSlide()) {
      return [{ t: 0, position: 0, velocity: 0 }];
    }
    
    const totalTime = this.getTimeToBottom();
    
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * totalTime;
      const position = this.getPosition(t);
      const velocity = this.getVelocity(t);
      points.push({ t, position, velocity });
    }
    
    return points;
  }

  /**
   * Calculate energy at any point
   */
  getEnergy(position) {
    const height = position * Math.sin(this.theta);
    const potentialEnergy = this.mass * GRAVITY * (this.length * Math.sin(this.theta) - height);
    
    const velocity = Math.sqrt(2 * this.getAcceleration() * position);
    const kineticEnergy = 0.5 * this.mass * velocity * velocity;
    
    const workByFriction = this.getFrictionForce() * position;
    
    return {
      potential: potentialEnergy,
      kinetic: kineticEnergy,
      workByFriction: workByFriction,
      total: potentialEnergy + kineticEnergy
    };
  }

  /**
   * Get all key metrics
   */
  getMetrics() {
    return {
      angle: this.angle,
      mass: this.mass,
      frictionCoefficient: this.mu,
      parallelForce: this.getParallelForce(),
      normalForce: this.getNormalForce(),
      frictionForce: this.getFrictionForce(),
      netForce: this.getNetForce(),
      acceleration: this.getAcceleration(),
      willSlide: this.willSlide(),
      timeToBottom: this.willSlide() ? this.getTimeToBottom() : null,
      finalVelocity: this.willSlide() ? this.getFinalVelocity() : null
    };
  }
}

/**
 * Find minimum angle for sliding with given friction
 */
export function findMinimumAngleForSliding(frictionCoefficient) {
  return Math.atan(frictionCoefficient) * 180 / Math.PI;
}

/**
 * Find maximum friction coefficient for sliding at given angle
 */
export function findMaximumFriction(angle) {
  return Math.tan(angle * Math.PI / 180);
}
