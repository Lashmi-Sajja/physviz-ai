/**
 * Relative Velocity Physics Engine
 * Handles river crossing, airplane wind scenarios, and general relative motion
 */

export class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  angleDegrees() {
    return this.angle() * 180 / Math.PI;
  }

  scale(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  normalize() {
    const mag = this.magnitude();
    return mag === 0 ? new Vector2D(0, 0) : this.scale(1 / mag);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  static fromPolar(magnitude, angleDegrees) {
    const angleRad = angleDegrees * Math.PI / 180;
    return new Vector2D(
      magnitude * Math.cos(angleRad),
      magnitude * Math.sin(angleRad)
    );
  }
}

/**
 * River Crossing Scenario
 */
export class RiverCrossing {
  constructor(riverWidth, riverVelocity, boatSpeed) {
    this.width = riverWidth; // meters
    this.riverVelocity = new Vector2D(riverVelocity, 0); // Perpendicular to banks
    this.boatSpeed = boatSpeed; // m/s in still water
  }

  /**
   * Calculate boat heading to reach directly across
   * (compensating for current)
   */
  getDirectCrossingAngle() {
    // Need: boat velocity + river velocity = perpendicular to bank
    // Let angle θ be boat heading from perpendicular
    // vb * cos(θ) = -vr (to cancel river current in x direction)
    
    if (this.boatSpeed <= Math.abs(this.riverVelocity.x)) {
      return null; // Boat too slow to cross directly
    }
    
    const sinTheta = this.riverVelocity.x / this.boatSpeed;
    return -Math.asin(sinTheta) * 180 / Math.PI; // Negative for upstream angle
  }

  /**
   * Calculate results for perpendicular heading (90° to bank)
   */
  getPerpendicularCrossing() {
    const boatVelocity = new Vector2D(0, this.boatSpeed);
    const resultantVelocity = boatVelocity.add(this.riverVelocity);
    
    const time = this.width / this.boatSpeed;
    const drift = this.riverVelocity.x * time;
    
    return {
      boatVelocity: boatVelocity,
      resultantVelocity: resultantVelocity,
      time: time,
      drift: drift,
      totalDistance: Math.sqrt(this.width * this.width + drift * drift),
      angle: resultantVelocity.angleDegrees()
    };
  }

  /**
   * Calculate results for direct crossing (perpendicular resultant)
   */
  getDirectCrossing() {
    const angle = this.getDirectCrossingAngle();
    if (angle === null) {
      return null;
    }

    const boatVelocity = Vector2D.fromPolar(this.boatSpeed, angle + 90);
    const resultantVelocity = boatVelocity.add(this.riverVelocity);
    
    const time = this.width / resultantVelocity.magnitude();
    
    return {
      boatVelocity: boatVelocity,
      resultantVelocity: resultantVelocity,
      time: time,
      drift: 0,
      angle: angle,
      headingAngle: angle + 90
    };
  }

  /**
   * Calculate results for arbitrary heading angle
   */
  getCrossingAtAngle(headingAngleDegrees) {
    const boatVelocity = Vector2D.fromPolar(this.boatSpeed, headingAngleDegrees);
    const resultantVelocity = boatVelocity.add(this.riverVelocity);
    
    // Time based on vertical component
    if (Math.abs(resultantVelocity.y) < 0.001) {
      return null; // Would never reach other side
    }
    
    const time = this.width / resultantVelocity.y;
    const drift = resultantVelocity.x * time;
    
    return {
      boatVelocity: boatVelocity,
      resultantVelocity: resultantVelocity,
      time: time,
      drift: drift,
      totalDistance: resultantVelocity.magnitude() * time,
      angle: resultantVelocity.angleDegrees()
    };
  }

  /**
   * Get trajectory for visualization
   */
  getTrajectory(headingAngleDegrees, numPoints = 50) {
    const result = this.getCrossingAtAngle(headingAngleDegrees);
    if (!result) return [];

    const points = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * result.time;
      const position = result.resultantVelocity.scale(t);
      points.push({ x: position.x, y: position.y, t });
    }
    
    return points;
  }
}

/**
 * Airplane Wind Scenario
 */
export class AirplaneWind {
  constructor(airspeed, windSpeed, windDirectionDegrees) {
    this.airspeed = airspeed; // km/h
    this.windVelocity = Vector2D.fromPolar(windSpeed, windDirectionDegrees);
  }

  /**
   * Calculate ground velocity for given heading
   */
  getGroundVelocity(headingDegrees) {
    const airVelocity = Vector2D.fromPolar(this.airspeed, headingDegrees);
    return airVelocity.add(this.windVelocity);
  }

  /**
   * Calculate heading needed to reach a target bearing
   */
  getHeadingForBearing(targetBearingDegrees) {
    // We need to find heading such that resultant is in target direction
    const targetDir = Vector2D.fromPolar(1, targetBearingDegrees);
    
    // Using vector math: Va + Vw = k * targetDir
    // We know |Va| = airspeed, and direction of targetDir
    
    const windSpeed = this.windVelocity.magnitude();
    const windAngle = this.windVelocity.angleDegrees();
    
    // Angle between wind and target bearing
    const beta = (windAngle - targetBearingDegrees) * Math.PI / 180;
    
    // Check if solution exists
    const discriminant = this.airspeed * this.airspeed - windSpeed * windSpeed * Math.sin(beta) * Math.sin(beta);
    
    if (discriminant < 0) {
      return null; // Wind too strong relative to airspeed
    }
    
    // Heading correction angle
    const correction = Math.asin(windSpeed * Math.sin(beta) / this.airspeed) * 180 / Math.PI;
    
    return targetBearingDegrees - correction;
  }

  /**
   * Calculate time to reach destination
   */
  getFlightTime(distanceKm, headingDegrees) {
    const groundVelocity = this.getGroundVelocity(headingDegrees);
    return distanceKm / groundVelocity.magnitude();
  }

  /**
   * Get flight data for target bearing
   */
  getFlightData(targetBearingDegrees, distanceKm) {
    const heading = this.getHeadingForBearing(targetBearingDegrees);
    
    if (heading === null) {
      return null;
    }

    const groundVelocity = this.getGroundVelocity(heading);
    const time = distanceKm / groundVelocity.magnitude();
    
    return {
      heading: heading,
      groundSpeed: groundVelocity.magnitude(),
      groundVelocity: groundVelocity,
      time: time,
      headingCorrection: heading - targetBearingDegrees
    };
  }
}

/**
 * General relative velocity between two objects
 */
export class RelativeVelocity {
  constructor(velocityA, velocityB) {
    this.vA = velocityA instanceof Vector2D ? velocityA : new Vector2D(velocityA.x, velocityA.y);
    this.vB = velocityB instanceof Vector2D ? velocityB : new Vector2D(velocityB.x, velocityB.y);
  }

  /**
   * Velocity of A relative to B
   */
  getRelativeVelocity() {
    return this.vA.subtract(this.vB);
  }

  /**
   * Velocity of B relative to A
   */
  getReverseRelativeVelocity() {
    return this.vB.subtract(this.vA);
  }

  /**
   * Time to closest approach
   */
  getTimeToClosestApproach(posA, posB) {
    const relPos = new Vector2D(posB.x - posA.x, posB.y - posA.y);
    const relVel = this.getRelativeVelocity();
    
    const relSpeed2 = relVel.magnitude() * relVel.magnitude();
    if (relSpeed2 === 0) return Infinity;
    
    const t = -relPos.dot(relVel) / relSpeed2;
    return Math.max(0, t);
  }

  /**
   * Minimum distance between objects
   */
  getClosestApproachDistance(posA, posB) {
    const t = this.getTimeToClosestApproach(posA, posB);
    const relPos = new Vector2D(posB.x - posA.x, posB.y - posA.y);
    const relVel = this.getRelativeVelocity();
    
    const separation = relPos.add(relVel.scale(t));
    return separation.magnitude();
  }
}
