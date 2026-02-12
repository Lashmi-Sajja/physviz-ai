# Physics Simulation Modules

A collection of interactive physics simulators with beautiful visualizations and accurate physics calculations.

## Modules

### 1. Projectile Motion
Simulates objects launched at angles with:
- Trajectory visualization
- Time of flight, max height, and range calculations
- Adjustable velocity, angle, and initial height
- Real-time animation

**Location:** `projectile-motion/`

**Features:**
- Interactive parameter controls
- Live trajectory plotting
- Velocity component breakdown
- Optimal angle calculation

### 2. Inclined Plane
Models motion on inclined surfaces with:
- Friction analysis
- Force decomposition
- Sliding motion prediction
- Energy calculations

**Location:** `inclined-plane/`

**Features:**
- Adjustable angle, mass, friction, and length
- Force vector visualization
- "Will it slide?" prediction
- Animated block motion

### 3. Relative Velocity
Handles river crossing and airplane wind scenarios:
- River crossing strategies
- Wind navigation for aircraft
- Vector addition visualization
- Multiple approach comparison

**Location:** `relative-velocity/`

**Features:**
- Perpendicular vs. direct crossing
- Custom heading control
- Drift and time calculations
- Animated boat/plane motion

### 4. Circular Motion
Analyzes uniform circular motion with:
- Angular and linear velocity
- Centripetal acceleration and force
- Period and frequency
- Vector visualization

**Location:** `circular-motion/`

**Features:**
- Real-time orbit animation
- Velocity and acceleration vectors
- Motion trail
- Complete metrics display

## Usage

### Running the Modules

Each module can be run independently:

```bash
# Navigate to any module
cd projectile-motion
# Open index.html in a browser
open index.html

# Or use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Using the Physics Engines

Each module includes a standalone physics engine in `src/physics.js`:

```javascript
// Example: Projectile Motion
import { ProjectileMotion } from './src/physics.js';

const projectile = new ProjectileMotion(30, 45, 0); // velocity, angle, height
const metrics = projectile.getMetrics();
const trajectory = projectile.getTrajectory();

console.log(`Range: ${metrics.range}m`);
console.log(`Max Height: ${metrics.maxHeight}m`);
```

```javascript
// Example: Circular Motion
import { CircularMotion } from './src/physics.js';

const motion = new CircularMotion(5, 2); // radius (m), angular velocity (rad/s)
const velocity = motion.getLinearVelocity();
const acceleration = motion.getCentripetalAcceleration();
const force = motion.getCentripetalForce(10); // mass in kg

console.log(`Linear velocity: ${velocity}m/s`);
console.log(`Centripetal force: ${force}N`);
```

## Module Structure

```
physics-modules/
├── projectile-motion/
│   ├── index.html          # Interactive visualization
│   └── src/
│       └── physics.js      # Physics calculation engine
├── inclined-plane/
│   ├── index.html
│   └── src/
│       └── physics.js
├── relative-velocity/
│   ├── index.html
│   └── src/
│       └── physics.js
└── circular-motion/
    ├── index.html
    └── src/
        └── physics.js
```

## Physics Concepts

### Projectile Motion
- **Equations:** x = v₀ₓt, y = h₀ + v₀ᵧt - ½gt²
- **Key Concepts:** Parabolic trajectory, range formula, maximum height

### Inclined Plane
- **Equations:** F_parallel = mg sin(θ), F_normal = mg cos(θ)
- **Key Concepts:** Force decomposition, friction, acceleration a = g(sin(θ) - μcos(θ))

### Relative Velocity
- **Equations:** v_resultant = v_object + v_medium
- **Key Concepts:** Vector addition, crossing time, drift calculation

### Circular Motion
- **Equations:** v = rω, a_c = rω² = v²/r
- **Key Concepts:** Centripetal acceleration, angular velocity, period T = 2π/ω

## Design Philosophy

Each visualization features:
- **Distinctive aesthetics** - No generic UI, each module has its own visual identity
- **Real-time feedback** - Instant parameter updates
- **Educational clarity** - Clear display of all key metrics
- **Smooth animations** - High-quality motion rendering
- **Responsive design** - Works on desktop and tablet

## Technical Details

- **Pure JavaScript** - No framework dependencies
- **Canvas API** - Hardware-accelerated rendering
- **ES6 Modules** - Clean, importable physics engines
- **Responsive** - Adapts to different screen sizes

## Contributing

To add a new physics simulation:

1. Create a new module directory
2. Implement physics calculations in `src/physics.js`
3. Create visualization in `index.html`
4. Follow the established patterns for UI and controls
5. Document the physics equations and concepts

## License

MIT License - Free to use for educational and commercial purposes
