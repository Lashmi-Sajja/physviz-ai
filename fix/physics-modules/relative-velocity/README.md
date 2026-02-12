# Relative Velocity Simulator

River crossing and airplane wind navigation scenarios.

## Features

- River crossing simulation
- Multiple crossing strategies:
  - Perpendicular heading (point straight across)
  - Direct crossing (compensate for current)
  - Custom angle
- Real-time drift calculation
- Animated boat/plane motion

## Physics

### Vector Addition
- **Resultant velocity:** v_resultant = v_boat + v_river
- **Crossing time:** t = width / v_y
- **Drift:** d = v_x × t

### Direct Crossing
For zero drift, boat heading must satisfy:
v_boat × sin(θ) = -v_river

## Parameters

- River width (50-500 m)
- Current speed (0.5-5 m/s)
- Boat speed (1-8 m/s)
- Heading angle (0-180°)

## Usage

### Browser
Open `index.html` in a web browser.

### As Library
```javascript
import { RiverCrossing } from './src/physics.js';

const river = new RiverCrossing(200, 2, 4);
const perpendicular = river.getCrossingAtAngle(90);
console.log(`Drift: ${perpendicular.drift}m`);

const directAngle = river.getDirectCrossingAngle();
console.log(`Direct crossing angle: ${directAngle}°`);
```

## Controls

- **Width/Speed Sliders:** Set river parameters
- **Strategy Buttons:** Choose crossing approach
- **Custom Angle:** Fine-tune boat heading
- **Simulate Button:** Animate the crossing

## Design

Nautical theme with:
- Deep water blues and boat yellows
- Libre Baskerville italic headings
- Flowing river visualization
- Animated boat with wake trail
