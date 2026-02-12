/**
 * Projectile Motion Physics Engine
 * Calculates trajectory, range, time of flight, and key parameters
 */

const GRAVITY = 9.81; // m/s²

export class ProjectileMotion {
  constructor(initialVelocity, angle, height = 0) {
    this.v0 = initialVelocity; // m/s
    this.theta = angle * Math.PI / 180; // Convert to radians
    this.h0 = height; // Initial height in meters
    
    // Component velocities
    this.v0x = this.v0 * Math.cos(this.theta);
    this.v0y = this.v0 * Math.sin(this.theta);
  }

  /**
   * Calculate position at time t
   */
  getPosition(t) {
    const x = this.v0x * t;
    const y = this.h0 + this.v0y * t - 0.5 * GRAVITY * t * t;
    return { x, y };
  }

  /**
   * Calculate velocity at time t
   */
  getVelocity(t) {
    const vx = this.v0x;
    const vy = this.v0y - GRAVITY * t;
    const magnitude = Math.sqrt(vx * vx + vy * vy);
    const angle = Math.atan2(vy, vx) * 180 / Math.PI;
    return { vx, vy, magnitude, angle };
  }

  /**
   * Calculate time of flight (when projectile hits ground)
   */
  getTimeOfFlight() {
    // Solve: h0 + v0y*t - 0.5*g*t² = 0
    const discriminant = this.v0y * this.v0y + 2 * GRAVITY * this.h0;
    return (this.v0y + Math.sqrt(discriminant)) / GRAVITY;
  }

  /**
   * Calculate maximum height reached
   */
  getMaxHeight() {
    const timeToMaxHeight = this.v0y / GRAVITY;
    return this.h0 + (this.v0y * this.v0y) / (2 * GRAVITY);
  }

  /**
   * Calculate horizontal range
   */
  getRange() {
    const timeOfFlight = this.getTimeOfFlight();
    return this.v0x * timeOfFlight;
  }

  /**
   * Get trajectory points for visualization
   */
  getTrajectory(numPoints = 100) {
    const totalTime = this.getTimeOfFlight();
    const points = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * totalTime;
      const pos = this.getPosition(t);
      if (pos.y >= 0) {
        points.push({ ...pos, t });
      }
    }
    
    return points;
  }

  /**
   * Get key metrics
   */
  getMetrics() {
    return {
      timeOfFlight: this.getTimeOfFlight(),
      maxHeight: this.getMaxHeight(),
      range: this.getRange(),
      initialVelocityX: this.v0x,
      initialVelocityY: this.v0y
    };
  }
}

/**
 * Find angle for maximum range (45° when h0 = 0)
 */
export function findOptimalAngle(velocity, height = 0) {
  if (height === 0) return 45;
  
  // For non-zero height, optimal angle is < 45°
  let maxRange = 0;
  let optimalAngle = 45;
  
  for (let angle = 0; angle <= 90; angle += 0.1) {
    const proj = new ProjectileMotion(velocity, angle, height);
    const range = proj.getRange();
    if (range > maxRange) {
      maxRange = range;
      optimalAngle = angle;
    }
  }
  
  return optimalAngle;
}

/**
 * Calculate velocity needed to hit a target at (x, y)
 */
export function calculateRequiredVelocity(x, y, angle, h0 = 0) {
  const theta = angle * Math.PI / 180;
  const tanTheta = Math.tan(theta);
  const cos2Theta = Math.cos(theta) * Math.cos(theta);
  
  // Derived from trajectory equation
  const numerator = GRAVITY * x * x;
  const denominator = 2 * cos2Theta * (x * tanTheta - (y - h0));
  
  if (denominator <= 0) return null; // Target unreachable at this angle
  
  return Math.sqrt(numerator / denominator);
}
