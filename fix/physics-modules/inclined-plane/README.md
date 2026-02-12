# Inclined Plane Simulator

Analyze motion on inclined surfaces with friction.

## Features

- Force decomposition visualization
- Friction analysis
- Motion prediction ("will it slide?")
- Adjustable parameters:
  - Incline angle (0-60°)
  - Mass (1-50 kg)
  - Friction coefficient (0-1)
  - Plane length (5-30 m)

## Physics

### Equations
- **Parallel force:** F‖ = mg sin(θ)
- **Normal force:** F⊥ = mg cos(θ)
- **Friction force:** f = μ × F⊥
- **Net force:** F_net = F‖ - f
- **Acceleration:** a = F_net / m = g(sin(θ) - μcos(θ))

### Sliding Condition
Object slides when: tan(θ) > μ

### Calculated Metrics
- All force components
- Acceleration
- Time to bottom
- Final velocity

## Usage

### Browser
Open `index.html` in a web browser.

### As Library
```javascript
import { InclinedPlane } from './src/physics.js';

const plane = new InclinedPlane(30, 10, 0.3, 15);
console.log(plane.willSlide()); // true/false
console.log(plane.getAcceleration()); // m/s²
console.log(plane.getTimeToBottom()); // seconds
```

## Design

Retro space theme with:
- Orange and blue color scheme
- Playfair Display italic headings
- Animated sliding block
- Force vector visualization
