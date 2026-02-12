# Circular Motion Simulator

Uniform circular motion with vector visualization.

## Features

- Real-time orbit animation
- Vector displays:
  - Velocity (tangent to circle)
  - Acceleration (toward center)
  - Motion trail
- Complete metrics:
  - Linear and angular velocity
  - Centripetal acceleration and force
  - Period and frequency
  - RPM

## Physics

### Equations
- **Linear velocity:** v = rω
- **Centripetal acceleration:** a_c = rω² = v²/r
- **Centripetal force:** F_c = ma_c = mrω²
- **Period:** T = 2π/ω
- **Frequency:** f = ω/(2π)

### Relationships
- RPM = (ω × 60)/(2π)
- 1 revolution = 2π radians

## Parameters

- Radius (50-250 pixels → 0.5-2.5 m)
- Angular velocity (0.1-5 rad/s)
- Mass (1-20 kg)

## Usage

### Browser
Open `index.html` in a web browser.

### As Library
```javascript
import { CircularMotion } from './src/physics.js';

const motion = new CircularMotion(5, 2);
console.log(motion.getLinearVelocity()); // m/s
console.log(motion.getCentripetalAcceleration()); // m/s²
console.log(motion.getPeriod()); // seconds
console.log(motion.getCentripetalForce(10)); // N for 10kg mass
```

## Controls

- **Radius Slider:** Set orbit size
- **Angular Velocity:** Set rotation speed
- **Mass Slider:** Set object mass
- **Checkboxes:** Toggle vector displays
- **Start Button:** Animate the motion

## Design

Space theme with:
- Dark cosmic background
- Cyan and blue orbital colors
- Crimson italic headings
- Glowing vectors and trail
