# PhysicsViz - Quick Start Guide

## What We Built (A → B → C)

### A: Modular Architecture
- `BaseScenario` class for all physics modules
- `ScenarioManager` for loading and managing scenarios
- Extensible plugin system

### B: Top 3 Priority Modules
1. **Projectile Motion** - Launch at angle with parabolic trajectory
2. **Free Fall** - Object dropped from height
3. **Friction** - Block sliding with resistance

### C: Scenario Selector UI
- Visual module selection grid
- Parameter adjustment interface
- Real-time visualization canvas
- Insights and What-If panels

## Project Structure

```
physviz-ai/
├── src/
│   ├── core/
│   │   ├── BaseScenario.js      # Base class for all scenarios
│   │   └── ScenarioManager.js   # Scenario management
│   ├── scenarios/
│   │   ├── ProjectileMotion.js  # Angle-based projectile
│   │   ├── FreeFall.js          # Dropped object
│   │   └── Friction.js          # Sliding with friction
│   ├── index.html               # Main UI
│   ├── styles.css               # Styling
│   └── app.js                   # Application logic
├── server.py                    # Flask server
├── requirements.txt             # Python dependencies
└── docs/                        # Documentation
```

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Server
```bash
python server.py
```

### 3. Open Browser
```
http://localhost:5000
```

## How to Use

1. **Select Module** - Click on a physics scenario card
2. **Enter Problem** - Type problem or click "Quick Start"
3. **Adjust Parameters** - Use sliders to modify values
4. **Start Simulation** - Watch the animation
5. **View Insights** - See real-time physics insights

## Features Implemented

### Each Module Has:
- Physics calculations (kinematic equations)
- Canvas rendering with visual elements
- Real-time insights during simulation
- What-If scenario predictions
- Parameter controls

### Projectile Motion
- Parabolic trajectory visualization
- Velocity vector display
- Max height and range markers
- Component velocity tracking

### Free Fall
- Vertical motion animation
- Height scale markers
- Velocity arrow (increasing)
- Impact detection

### Friction
- Sliding block visualization
- Friction force arrows
- Deceleration tracking
- Stop distance prediction

## Next Steps

### Phase 2 (Add More Modules)
- Vertical Projectile (straight up)
- Inclined Plane
- Elastic Collision
- Spring/SHM

### Phase 3 (Backend Integration)
- AI problem parsing with LLM
- Natural language understanding
- Auto-parameter extraction

### Phase 4 (Enhancements)
- Save/share simulations
- Multiple objects
- Force diagrams
- Energy graphs

## File Descriptions

### Core Files
- **BaseScenario.js** - Abstract base class with update/render methods
- **ScenarioManager.js** - Registers and manages all scenarios

### Scenario Files
Each scenario implements:
- `static matches(text)` - Keyword detection
- `calculateState()` - Physics calculations
- `render(ctx)` - Canvas drawing
- `checkInsights()` - Generate insights
- `getWhatIf()` - What-if predictions

### UI Files
- **index.html** - Structure with scenario selector
- **styles.css** - Modern gradient design
- **app.js** - Event handling and animation loop

## Testing

Try these examples:

**Projectile Motion:**
- "A ball is thrown at 45 degrees with speed 20 m/s"
- Adjust angle to see range changes

**Free Fall:**
- "A ball is dropped from 50 meters"
- Adjust height to see time changes

**Friction:**
- "A 10kg block slides at 20 m/s with μ=0.3"
- Adjust friction to see stopping distance

## Architecture Benefits

1. **Modular** - Easy to add new scenarios
2. **Extensible** - Each module is independent
3. **Maintainable** - Clear separation of concerns
4. **Scalable** - Can add unlimited physics modules

## Adding New Modules

```javascript
import { BaseScenario } from '../core/BaseScenario.js';

export class NewScenario extends BaseScenario {
  static id = 'new_scenario';
  static keywords = ['keyword1', 'keyword2'];
  
  static matches(text) {
    return this.keywords.some(kw => text.includes(kw));
  }
  
  calculateState() {
    // Physics calculations
  }
  
  render(ctx) {
    // Canvas drawing
  }
}
```

Then register in `app.js`:
```javascript
import { NewScenario } from './scenarios/NewScenario.js';
this.manager.register(NewScenario);
```

## Current Status

**Complete:**
- Modular architecture
- 3 working physics modules
- Scenario selector UI
- Real-time visualization
- Insights system
- What-If predictions

**Partial:**
- AI parsing (needs backend)
- More physics modules

**Todo:**
- Backend LLM integration
- 11 more physics modules
- Save/share features
