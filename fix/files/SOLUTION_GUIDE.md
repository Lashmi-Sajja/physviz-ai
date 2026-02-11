# Solution: Universal Physics Simulator

## Your Problem
✅ NLP parsing works  
❌ Can only render: ball projectile (ground only), block with friction  
❌ Cannot render: projectile from height, pulley systems, inclined planes, block on plank

## The Solution
**You DON'T need a new ML model!** You just need:
1. Standardized JSON format from your parser
2. Scenario-specific rendering engines
3. Universal canvas renderer

---

## Architecture Overview

```
User Input → NLP Parser (Claude API) → Standardized JSON → Universal Simulator → Canvas Rendering
                                                ↓
                                    Scenario Type Detection
                                                ↓
                        ┌───────────┬────────────┬──────────┬─────────┐
                   Projectile    Pulley      Incline    Friction   Spring
                     Engine      Engine       Engine     Engine    Engine
```

---

## File Structure

```
src/
├── universal-simulator.jsx       # Main simulator component
├── example-scenarios.js          # JSON format examples
├── integration-example.jsx       # Complete working example
└── physics-platform.jsx          # Your existing platform
```

---

## How It Works

### Step 1: Standardize Your Parser Output

Your NLP parser should output JSON in this exact format:

```javascript
{
  "scenario_type": "projectile" | "pulley" | "incline" | "friction",
  "description": "Brief summary",
  "entities": [
    {
      "id": "unique_id",
      "type": "ball" | "block" | "pulley" | "plane",
      "label": "Display name",
      "mass": number,
      "initial_position": {"x": number, "y": number},
      "initial_velocity": {"x": number, "y": number},
      "dimensions": {"width": number, "height": number},
      "properties": {}
    }
  ],
  "constraints": [...],
  "forces": [...],
  "environment": {"gravity": 9.8, ...},
  "visualization_hints": {...}
}
```

### Step 2: Universal Simulator Handles Everything

```javascript
import UniversalPhysicsSimulator from './universal-simulator';

// Just pass your parsed JSON
<UniversalPhysicsSimulator parsedScenario={yourParsedJSON} />
```

The simulator automatically:
- Detects `scenario_type`
- Runs the correct physics engine
- Renders the appropriate visualization
- Updates in real-time at 60 FPS

---

## Supported Scenarios

### 1. Projectile from Height ✅

**Input:** "A 2kg ball is thrown from a 20m building at 15 m/s horizontally"

**JSON:**
```javascript
{
  "scenario_type": "projectile",
  "entities": [
    {
      "id": "ball_1",
      "type": "ball",
      "mass": 2,
      "initial_position": {"x": 0, "y": 20},  // ← Height!
      "initial_velocity": {"x": 15, "y": 0}
    },
    {
      "id": "building_1",
      "type": "structure",
      "properties": {"height": 20}
    }
  ],
  "environment": {"gravity": 9.8}
}
```

**Physics Engine:** `projectileFromHeightEngine()`
- Calculates: x = x₀ + vₓt, y = y₀ + vᵧt - ½gt²
- Renders: Building, ball with trajectory, velocity vectors

---

### 2. Pulley System (Atwood Machine) ✅

**Input:** "A 5kg and 3kg mass are connected by a rope over a pulley"

**JSON:**
```javascript
{
  "scenario_type": "pulley",
  "entities": [
    {
      "id": "block_1",
      "type": "block",
      "mass": 5,
      "initial_position": {"x": -1, "y": 3}
    },
    {
      "id": "block_2",
      "type": "block",
      "mass": 3,
      "initial_position": {"x": 1, "y": 3}
    },
    {
      "id": "pulley_1",
      "type": "pulley",
      "properties": {
        "radius": 0.15,
        "position": {"x": 0, "y": 4}
      }
    }
  ],
  "constraints": [
    {
      "type": "rope",
      "entities": ["block_1", "pulley_1", "block_2"]
    }
  ]
}
```

**Physics Engine:** `pulleySystemEngine()`
- Calculates: a = (m₁ - m₂)g / (m₁ + m₂)
- Calculates: T = 2m₁m₂g / (m₁ + m₂)
- Renders: Pulley wheel, two blocks, rope, tension labels

---

### 3. Inclined Plane ✅

**Input:** "A 4kg block slides down a 30-degree incline with friction 0.2"

**JSON:**
```javascript
{
  "scenario_type": "incline",
  "entities": [
    {
      "id": "block_1",
      "type": "block",
      "mass": 4,
      "initial_position": {"x": 0, "y": 2.5}  // At top
    },
    {
      "id": "incline_1",
      "type": "plane",
      "properties": {
        "angle": 30,
        "length": 5,
        "height": 2.5
      }
    }
  ],
  "environment": {
    "gravity": 9.8,
    "friction_coefficient": 0.2
  }
}
```

**Physics Engine:** `inclinedPlaneEngine()`
- Calculates: a = g(sin θ - μ cos θ)
- Calculates: Normal force, friction force
- Renders: Inclined triangle, block (rotated), angle indicator

---

### 4. Block on Plank (Friction) ✅

**Input:** "A block with initial speed 8 m/s slides on a plank with friction 0.3"

**JSON:**
```javascript
{
  "scenario_type": "friction",
  "entities": [
    {
      "id": "block_1",
      "type": "block",
      "mass": 3,
      "initial_velocity": {"x": 8, "y": 0}  // ← Initial push
    },
    {
      "id": "plank_1",
      "type": "block",
      "label": "Plank",
      "properties": {"length": 5}
    }
  ],
  "environment": {
    "friction_coefficient": 0.3
  }
}
```

**Physics Engine:** `blockOnPlankEngine()`
- Calculates: a = -μg (deceleration)
- Calculates: v(t) = v₀ - μgt
- Renders: Horizontal plank, sliding block, friction arrows

---

## Implementation Guide

### Method 1: Use Provided Files (Easiest)

```javascript
// 1. Copy files to your project
import UniversalPhysicsSimulator from './universal-simulator';
import { projectileFromBuilding, pulleySystem } from './example-scenarios';

// 2. Use directly
function App() {
  return <UniversalPhysicsSimulator parsedScenario={projectileFromBuilding} />;
}
```

### Method 2: Integrate with Your Parser

```javascript
const [parsedScenario, setParsedScenario] = useState(null);

// Your existing parser
const parseUserInput = async (input) => {
  const response = await callYourNLPParser(input);
  
  // Ensure it matches the standardized format
  const standardized = {
    scenario_type: response.type,
    entities: response.objects,
    // ... map your format to standard format
  };
  
  setParsedScenario(standardized);
};

return <UniversalPhysicsSimulator parsedScenario={parsedScenario} />;
```

### Method 3: Add New Scenario Types

```javascript
// In universal-simulator.jsx

// Add new physics engine
const springSystemEngine = (t, scenario, prevState) => {
  const mass = scenario.entities[0].mass;
  const k = scenario.environment.spring_constant;
  const omega = Math.sqrt(k / mass);
  
  const x = scenario.entities[0].initial_position.x * Math.cos(omega * t);
  const v = -scenario.entities[0].initial_position.x * omega * Math.sin(omega * t);
  
  return {
    entities: {
      [scenario.entities[0].id]: {
        position: { x, y: 0 },
        velocity: { x: v, y: 0 }
      }
    }
  };
};

// Add to calculateState switch
case 'spring':
  return springSystemEngine(t, scenario, prevState);

// Add new renderer
const renderSpring = (ctx, width, height, groundY, scale, scenario, state) => {
  // Draw spring, mass, oscillation
};

// Add to renderScene switch
case 'spring':
  renderSpring(ctx, width, height, groundY, scale, scenario, state);
```

---

## Parser Requirements

Your NLP parser MUST extract these key elements:

### For Projectiles:
- ✅ Initial height (y-position)
- ✅ Initial velocity (horizontal and/or vertical)
- ✅ Launch angle (if applicable)

### For Pulleys:
- ✅ Number of masses
- ✅ Mass values
- ✅ Pulley type (fixed/movable)
- ✅ Initial positions

### For Inclines:
- ✅ Incline angle
- ✅ Coefficient of friction
- ✅ Block mass
- ✅ Initial position (top/middle/bottom)

### For Friction:
- ✅ Initial velocity
- ✅ Coefficient of friction
- ✅ Surface length

---

## Claude API Integration (Recommended)

```javascript
const parseWithClaude = async (userInput) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: `Parse physics problems into JSON format:
{
  "scenario_type": "projectile|pulley|incline|friction",
  "entities": [...],
  "environment": {...}
}

CRITICAL:
- For projectiles from height, set initial_position.y > 0
- For pulleys, create separate block entities
- Extract ALL numeric values
- Return ONLY JSON`,
      messages: [{ role: "user", content: userInput }]
    })
  });

  const data = await response.json();
  return JSON.parse(data.content[0].text);
};
```

---

## Common Issues & Solutions

### Issue 1: "Ball always starts from ground"
**Problem:** Parser sets `initial_position.y = 0` for all projectiles  
**Solution:** Check for keywords "building", "height", "cliff", "drop"

```javascript
if (input.includes('building') || input.includes('height')) {
  entity.initial_position.y = extractedHeight;
} else {
  entity.initial_position.y = 0;
}
```

### Issue 2: "Pulley doesn't work"
**Problem:** Missing pulley entity or wrong constraint format  
**Solution:** Always create 3 entities (2 blocks + 1 pulley)

```javascript
entities: [
  { id: "block_1", type: "block", mass: 5 },
  { id: "block_2", type: "block", mass: 3 },
  { id: "pulley_1", type: "pulley", properties: {...} }
]
```

### Issue 3: "Incline rendering is wrong"
**Problem:** Block not rotated or positioned incorrectly  
**Solution:** Calculate position along slope, store angle

```javascript
const newX = startX + distance * Math.cos(angle);
const newY = startY - distance * Math.sin(angle);
entity.angle = angle; // Store for rotation during render
```

---

## Testing Checklist

Test each scenario type:

```
✅ Projectile from ground (existing)
✅ Projectile from building
✅ Projectile at angle
✅ Atwood machine (2 masses, 1 pulley)
✅ Inclined plane (30°, 45°, 60°)
✅ Block with friction
✅ Block on plank
```

Use the test scenarios in `integration-example.jsx`:

```javascript
<button onClick={() => loadTestScenario(projectileFromBuilding)}>
  Test Projectile from Height
</button>
```

---

## Performance Tips

1. **Use RequestAnimationFrame**: Already implemented (60 FPS)
2. **Limit Re-renders**: Only update when `isPlaying === true`
3. **Canvas Optimization**: Clear only changed regions (advanced)
4. **State Management**: Use functional updates to avoid stale closures

---

## Next Steps

1. **Replace your current simulator component** with `UniversalPhysicsSimulator`
2. **Update your parser** to output standardized JSON format
3. **Test with provided examples** before using live parsing
4. **Add new scenarios** by following the pattern
5. **Deploy and win the hackathon!** 🏆

---

## Quick Start Commands

```bash
# 1. Copy files to your project
cp universal-simulator.jsx src/
cp example-scenarios.js src/
cp integration-example.jsx src/

# 2. Install dependencies (if needed)
npm install lucide-react

# 3. Import and use
import PhysicsSimulatorApp from './integration-example';

# 4. Test
npm start
```

---

## Support

If stuck, check:
1. `example-scenarios.js` - Exact JSON format for each type
2. `integration-example.jsx` - Complete working integration
3. Console logs - Debug parsed JSON structure

**Key insight:** The rendering IS NOT an ML problem. It's a data structure problem. Once your parser outputs the right JSON format, the simulator handles everything automatically.

Good luck! 🚀
