// ==================== EXAMPLE PARSED SCENARIOS ====================
// These are the exact JSON formats your NLP parser should output

// ==================== EXAMPLE 1: PROJECTILE FROM HEIGHT ====================
const projectileFromBuilding = {
  "scenario_type": "projectile",
  "description": "Ball thrown horizontally from a building",
  "entities": [
    {
      "id": "ball_1",
      "type": "ball",
      "label": "Ball",
      "mass": 2,
      "initial_position": { "x": 0, "y": 20 },  // 20m high
      "initial_velocity": { "x": 15, "y": 0 },   // 15 m/s horizontal
      "properties": { "radius": 0.1 }
    },
    {
      "id": "building_1",
      "type": "structure",
      "label": "Building",
      "properties": { "height": 20 }
    }
  ],
  "constraints": [],
  "forces": [
    {
      "type": "gravity",
      "magnitude": 19.6,
      "direction": { "x": 0, "y": -9.8 },
      "affects": ["ball_1"]
    }
  ],
  "environment": {
    "gravity": 9.8,
    "air_resistance": false
  },
  "visualization_hints": {
    "camera_position": { "x": 0, "y": 10 },
    "zoom_level": 1,
    "show_vectors": true,
    "ground_level": 0
  }
};

// ==================== EXAMPLE 2: PULLEY SYSTEM (ATWOOD MACHINE) ====================
const pulleySystem = {
  "scenario_type": "pulley",
  "description": "Two masses connected over a pulley",
  "entities": [
    {
      "id": "block_1",
      "type": "block",
      "label": "Block 1",
      "mass": 5,
      "initial_position": { "x": -1, "y": 3 },
      "initial_velocity": { "x": 0, "y": 0 },
      "dimensions": { "width": 0.3, "height": 0.3 }
    },
    {
      "id": "block_2",
      "type": "block",
      "label": "Block 2",
      "mass": 3,
      "initial_position": { "x": 1, "y": 3 },
      "initial_velocity": { "x": 0, "y": 0 },
      "dimensions": { "width": 0.3, "height": 0.3 }
    },
    {
      "id": "pulley_1",
      "type": "pulley",
      "label": "Pulley",
      "properties": {
        "radius": 0.15,
        "position": { "x": 0, "y": 4 },
        "frictionless": true
      }
    }
  ],
  "constraints": [
    {
      "type": "rope",
      "entities": ["block_1", "pulley_1", "block_2"],
      "properties": {
        "length": 6,
        "inextensible": true
      }
    }
  ],
  "forces": [
    {
      "type": "gravity",
      "magnitude": 49,
      "direction": { "x": 0, "y": -9.8 },
      "affects": ["block_1"]
    },
    {
      "type": "gravity",
      "magnitude": 29.4,
      "direction": { "x": 0, "y": -9.8 },
      "affects": ["block_2"]
    },
    {
      "type": "tension",
      "magnitude": "variable",
      "direction": "calculated",
      "affects": ["block_1", "block_2"]
    }
  ],
  "environment": {
    "gravity": 9.8
  },
  "visualization_hints": {
    "camera_position": { "x": 0, "y": 2 },
    "zoom_level": 0.8,
    "show_vectors": true,
    "ground_level": 0
  }
};

// ==================== EXAMPLE 3: INCLINED PLANE ====================
const inclinedPlane = {
  "scenario_type": "incline",
  "description": "Block sliding down an incline with friction",
  "entities": [
    {
      "id": "block_1",
      "type": "block",
      "label": "Block",
      "mass": 4,
      "initial_position": { "x": 0, "y": 2.5 },  // Start at top
      "initial_velocity": { "x": 0, "y": 0 },
      "dimensions": { "width": 0.3, "height": 0.3 }
    },
    {
      "id": "incline_1",
      "type": "plane",
      "label": "Incline",
      "properties": {
        "angle": 30,      // degrees
        "length": 5,      // meters along slope
        "height": 2.5     // vertical height
      }
    }
  ],
  "constraints": [
    {
      "type": "surface",
      "entities": ["block_1", "incline_1"],
      "properties": { "contact": true }
    }
  ],
  "forces": [
    {
      "type": "gravity",
      "magnitude": 39.2,
      "direction": { "x": 0, "y": -9.8 },
      "affects": ["block_1"]
    },
    {
      "type": "normal",
      "magnitude": "calculated",
      "direction": "perpendicular_to_surface",
      "affects": ["block_1"]
    },
    {
      "type": "friction",
      "magnitude": "calculated",
      "direction": "opposite_to_motion",
      "affects": ["block_1"]
    }
  ],
  "environment": {
    "gravity": 9.8,
    "friction_coefficient": 0.2
  },
  "visualization_hints": {
    "camera_position": { "x": 0, "y": 1.5 },
    "zoom_level": 1,
    "show_vectors": true,
    "ground_level": 0
  }
};

// ==================== EXAMPLE 4: BLOCK SLIDING ON PLANK (FRICTION) ====================
const blockOnPlank = {
  "scenario_type": "friction",
  "description": "Block sliding on a horizontal surface with friction",
  "entities": [
    {
      "id": "block_1",
      "type": "block",
      "label": "Block",
      "mass": 3,
      "initial_position": { "x": -2, "y": 1 },
      "initial_velocity": { "x": 8, "y": 0 },  // Initial push
      "dimensions": { "width": 0.3, "height": 0.3 }
    },
    {
      "id": "plank_1",
      "type": "block",  // Using block type for plank
      "label": "Plank",
      "initial_position": { "x": 0, "y": 1 },
      "properties": {
        "length": 5,
        "width": 0.5
      }
    }
  ],
  "constraints": [
    {
      "type": "surface",
      "entities": ["block_1", "plank_1"],
      "properties": { "contact": true }
    }
  ],
  "forces": [
    {
      "type": "friction",
      "magnitude": "calculated",
      "direction": { "x": -1, "y": 0 },
      "affects": ["block_1"]
    }
  ],
  "environment": {
    "gravity": 9.8,
    "friction_coefficient": 0.3
  },
  "visualization_hints": {
    "camera_position": { "x": 0, "y": 1 },
    "zoom_level": 1,
    "show_vectors": true,
    "ground_level": 0
  }
};

// ==================== EXAMPLE 5: PROJECTILE AT ANGLE FROM GROUND ====================
const projectileAtAngle = {
  "scenario_type": "projectile",
  "description": "Ball thrown at an angle from ground",
  "entities": [
    {
      "id": "ball_1",
      "type": "ball",
      "label": "Ball",
      "mass": 0.5,
      "initial_position": { "x": 0, "y": 0 },
      "initial_velocity": { 
        "x": 10 * Math.cos(45 * Math.PI / 180),  // v * cos(θ)
        "y": 10 * Math.sin(45 * Math.PI / 180)   // v * sin(θ)
      },
      "properties": { 
        "radius": 0.1,
        "launch_angle": 45  // Store original angle
      }
    }
  ],
  "constraints": [],
  "forces": [
    {
      "type": "gravity",
      "magnitude": 4.9,
      "direction": { "x": 0, "y": -9.8 },
      "affects": ["ball_1"]
    }
  ],
  "environment": {
    "gravity": 9.8,
    "air_resistance": false
  },
  "visualization_hints": {
    "camera_position": { "x": 0, "y": 2 },
    "zoom_level": 1,
    "show_vectors": true,
    "ground_level": 0
  }
};

// ==================== EXAMPLE 6: DOUBLE PULLEY (MOVABLE PULLEY) ====================
const movablePulley = {
  "scenario_type": "pulley",
  "description": "Movable pulley system with mechanical advantage",
  "entities": [
    {
      "id": "block_1",
      "type": "block",
      "label": "Load",
      "mass": 10,
      "initial_position": { "x": 0, "y": 2 },
      "initial_velocity": { "x": 0, "y": 0 },
      "dimensions": { "width": 0.4, "height": 0.4 }
    },
    {
      "id": "pulley_1",
      "type": "pulley",
      "label": "Movable Pulley",
      "properties": {
        "radius": 0.1,
        "position": { "x": 0, "y": 2.5 },
        "movable": true,
        "attached_to": "block_1"
      }
    },
    {
      "id": "pulley_2",
      "type": "pulley",
      "label": "Fixed Pulley",
      "properties": {
        "radius": 0.1,
        "position": { "x": 1, "y": 4 },
        "movable": false
      }
    }
  ],
  "constraints": [
    {
      "type": "rope",
      "entities": ["pulley_1", "pulley_2"],
      "properties": {
        "mechanical_advantage": 2
      }
    }
  ],
  "forces": [
    {
      "type": "gravity",
      "magnitude": 98,
      "direction": { "x": 0, "y": -9.8 },
      "affects": ["block_1"]
    },
    {
      "type": "tension",
      "magnitude": "variable",
      "direction": "calculated",
      "affects": ["block_1"]
    }
  ],
  "environment": {
    "gravity": 9.8
  },
  "visualization_hints": {
    "camera_position": { "x": 0, "y": 2 },
    "zoom_level": 0.9,
    "show_vectors": true,
    "ground_level": 0
  }
};

// ==================== HOW TO USE THESE IN YOUR APP ====================

/*
INTEGRATION STEPS:

1. Your NLP Parser Output:
   - Use Claude API to parse user input
   - Return JSON in one of these formats above
   
2. Pass to Universal Simulator:
   <UniversalPhysicsSimulator parsedScenario={yourParsedJSON} />

3. The simulator automatically:
   - Detects scenario_type
   - Runs appropriate physics engine
   - Renders correct visualization
   - Updates in real-time

EXAMPLE USAGE:

```javascript
const [parsedScenario, setParsedScenario] = useState(null);

// After parsing user input
const handleParse = async (userInput) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `Parse this physics problem into JSON: "${userInput}"`
      }]
    })
  });
  
  const data = await response.json();
  const json = JSON.parse(data.content[0].text);
  setParsedScenario(json);
};

return (
  <UniversalPhysicsSimulator parsedScenario={parsedScenario} />
);
```

SUPPORTED NATURAL LANGUAGE INPUTS:

✅ "A ball is thrown from a 20m building at 15 m/s horizontally"
✅ "A 5kg and 3kg mass are connected by a rope over a pulley"
✅ "A 4kg block slides down a 30 degree incline with friction 0.2"
✅ "A block with initial speed 8 m/s slides on a surface with friction 0.3"
✅ "Throw a ball at 45 degrees with speed 10 m/s"

*/

// Export all examples for testing
export {
  projectileFromBuilding,
  pulleySystem,
  inclinedPlane,
  blockOnPlank,
  projectileAtAngle,
  movablePulley
};
