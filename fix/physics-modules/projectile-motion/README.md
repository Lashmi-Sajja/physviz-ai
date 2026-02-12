# Projectile Motion Simulator

Interactive simulation of objects launched at angles under gravity.

## Features

- Real-time trajectory visualization
- Adjustable launch parameters:
  - Initial velocity (5-100 m/s)
  - Launch angle (0-90°)
  - Initial height (0-50 m)
- Animated projectile with motion trail
- Complete metrics display

## Physics

### Equations
- **Horizontal position:** x(t) = v₀ₓ × t
- **Vertical position:** y(t) = h₀ + v₀ᵧ × t - ½g × t²
- **Component velocities:** v₀ₓ = v₀ cos(θ), v₀ᵧ = v₀ sin(θ)

### Calculated Metrics
- Time of flight
- Maximum height
- Horizontal range
- Velocity components

## Usage

### Browser
Open `index.html` in a web browser.

### As Library
```javascript
import { ProjectileMotion } from './src/physics.js';

const proj = new ProjectileMotion(30, 45, 10);
console.log(proj.getRange()); // Horizontal range
console.log(proj.getMaxHeight()); // Maximum height
console.log(proj.getTimeOfFlight()); // Total time
```

## Controls

- **Velocity Slider:** Set initial launch speed
- **Angle Slider:** Set launch angle from horizontal
- **Height Slider:** Set starting height above ground
- **Launch Button:** Animate the projectile motion

## Design

Cyberpunk-inspired interface with:
- Neon cyan and pink gradient accents
- Italic serif title typography
- Grid background visualization
- Glowing projectile animation
