import React, { useState } from 'react';
import UniversalPhysicsSimulator from './universal-simulator';
import { 
  projectileFromBuilding, 
  pulleySystem, 
  inclinedPlane, 
  blockOnPlank,
  projectileAtAngle
} from './example-scenarios';

// ==================== COMPLETE INTEGRATION EXAMPLE ====================

const PhysicsSimulatorApp = () => {
  const [userInput, setUserInput] = useState('');
  const [parsedScenario, setParsedScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== METHOD 1: USE PREDEFINED SCENARIOS (FOR TESTING) ====================
  
  const testScenarios = [
    {
      id: 1,
      name: 'Projectile from Building',
      description: 'Ball thrown horizontally from 20m height',
      data: projectileFromBuilding
    },
    {
      id: 2,
      name: 'Pulley System',
      description: '5kg and 3kg masses on Atwood machine',
      data: pulleySystem
    },
    {
      id: 3,
      name: 'Inclined Plane',
      description: '4kg block sliding down 30° incline',
      data: inclinedPlane
    },
    {
      id: 4,
      name: 'Friction',
      description: 'Block sliding on plank with friction',
      data: blockOnPlank
    },
    {
      id: 5,
      name: 'Projectile at Angle',
      description: 'Ball thrown at 45° from ground',
      data: projectileAtAngle
    }
  ];

  const loadTestScenario = (scenario) => {
    setParsedScenario(scenario.data);
    setError(null);
  };

  // ==================== METHOD 2: PARSE WITH CLAUDE API (PRODUCTION) ====================
  
  const parseWithClaudeAPI = async () => {
    if (!userInput.trim()) {
      setError('Please enter a physics problem');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: `You are a physics problem parser. Parse the user's physics problem into structured JSON.

Output ONLY valid JSON in this format:
{
  "scenario_type": "projectile|pulley|incline|friction",
  "description": "brief summary",
  "entities": [
    {
      "id": "unique_id",
      "type": "ball|block|pulley|plane",
      "label": "display name",
      "mass": number,
      "initial_position": {"x": number, "y": number},
      "initial_velocity": {"x": number, "y": number},
      "dimensions": {"width": number, "height": number},
      "properties": {}
    }
  ],
  "constraints": [],
  "forces": [],
  "environment": {"gravity": 9.8},
  "visualization_hints": {}
}

RULES:
- Convert all units to SI (kg, m, m/s, N)
- For projectiles from height, set initial y > 0
- For pulleys, create 2 blocks and 1 pulley entity
- For inclines, specify angle in degrees
- Return ONLY JSON, no markdown`,
          messages: [
            {
              role: "user",
              content: userInput
            }
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Extract JSON from response
      let jsonText = data.content[0].text;
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const parsed = JSON.parse(jsonText);
      setParsedScenario(parsed);
      
    } catch (err) {
      console.error('Parsing error:', err);
      setError(`Failed to parse: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== METHOD 3: SIMPLE RULE-BASED PARSER (FALLBACK) ====================
  
  const parseWithRules = () => {
    const input = userInput.toLowerCase();
    
    // Detect projectile from height
    if ((input.includes('building') || input.includes('height') || input.includes('cliff')) 
        && (input.includes('thrown') || input.includes('ball'))) {
      
      // Extract numbers
      const heightMatch = input.match(/(\d+\.?\d*)\s*m.*?(high|tall|height)/i);
      const speedMatch = input.match(/(\d+\.?\d*)\s*m\/s/i);
      const massMatch = input.match(/(\d+\.?\d*)\s*kg/i);
      
      const height = heightMatch ? parseFloat(heightMatch[1]) : 20;
      const speed = speedMatch ? parseFloat(speedMatch[1]) : 15;
      const mass = massMatch ? parseFloat(massMatch[1]) : 2;
      
      setParsedScenario({
        scenario_type: 'projectile',
        description: 'Projectile from elevated position',
        entities: [
          {
            id: 'ball_1',
            type: 'ball',
            label: 'Ball',
            mass: mass,
            initial_position: { x: 0, y: height },
            initial_velocity: { x: speed, y: 0 },
            properties: { radius: 0.1 }
          },
          {
            id: 'building_1',
            type: 'structure',
            label: 'Building',
            properties: { height: height }
          }
        ],
        constraints: [],
        forces: [
          {
            type: 'gravity',
            magnitude: mass * 9.8,
            direction: { x: 0, y: -9.8 },
            affects: ['ball_1']
          }
        ],
        environment: { gravity: 9.8, air_resistance: false },
        visualization_hints: {
          camera_position: { x: 0, y: height / 2 },
          zoom_level: 1,
          show_vectors: true,
          ground_level: 0
        }
      });
      return;
    }
    
    // Detect pulley system
    if (input.includes('pulley') || (input.includes('rope') && input.includes('mass'))) {
      const masses = input.match(/(\d+\.?\d*)\s*kg/gi);
      const m1 = masses && masses[0] ? parseFloat(masses[0]) : 5;
      const m2 = masses && masses[1] ? parseFloat(masses[1]) : 3;
      
      setParsedScenario({
        scenario_type: 'pulley',
        description: 'Atwood machine',
        entities: [
          {
            id: 'block_1',
            type: 'block',
            label: 'Block 1',
            mass: m1,
            initial_position: { x: -1, y: 3 },
            initial_velocity: { x: 0, y: 0 },
            dimensions: { width: 0.3, height: 0.3 }
          },
          {
            id: 'block_2',
            type: 'block',
            label: 'Block 2',
            mass: m2,
            initial_position: { x: 1, y: 3 },
            initial_velocity: { x: 0, y: 0 },
            dimensions: { width: 0.3, height: 0.3 }
          },
          {
            id: 'pulley_1',
            type: 'pulley',
            label: 'Pulley',
            properties: {
              radius: 0.15,
              position: { x: 0, y: 4 },
              frictionless: true
            }
          }
        ],
        constraints: [
          {
            type: 'rope',
            entities: ['block_1', 'pulley_1', 'block_2'],
            properties: { length: 6, inextensible: true }
          }
        ],
        forces: [
          {
            type: 'gravity',
            magnitude: m1 * 9.8,
            direction: { x: 0, y: -9.8 },
            affects: ['block_1']
          },
          {
            type: 'gravity',
            magnitude: m2 * 9.8,
            direction: { x: 0, y: -9.8 },
            affects: ['block_2']
          }
        ],
        environment: { gravity: 9.8 },
        visualization_hints: {
          camera_position: { x: 0, y: 2 },
          zoom_level: 0.8,
          show_vectors: true,
          ground_level: 0
        }
      });
      return;
    }
    
    // Detect inclined plane
    if (input.includes('incline') || input.includes('ramp') || input.includes('slope')) {
      const angleMatch = input.match(/(\d+\.?\d*)\s*degree/i);
      const massMatch = input.match(/(\d+\.?\d*)\s*kg/i);
      const frictionMatch = input.match(/friction.*?(\d+\.?\d*)/i);
      
      const angle = angleMatch ? parseFloat(angleMatch[1]) : 30;
      const mass = massMatch ? parseFloat(massMatch[1]) : 4;
      const friction = frictionMatch ? parseFloat(frictionMatch[1]) : 0.2;
      
      const height = 5 * Math.sin(angle * Math.PI / 180);
      
      setParsedScenario({
        scenario_type: 'incline',
        description: 'Block on inclined plane',
        entities: [
          {
            id: 'block_1',
            type: 'block',
            label: 'Block',
            mass: mass,
            initial_position: { x: 0, y: height },
            initial_velocity: { x: 0, y: 0 },
            dimensions: { width: 0.3, height: 0.3 }
          },
          {
            id: 'incline_1',
            type: 'plane',
            label: 'Incline',
            properties: { angle: angle, length: 5, height: height }
          }
        ],
        constraints: [
          {
            type: 'surface',
            entities: ['block_1', 'incline_1'],
            properties: { contact: true }
          }
        ],
        forces: [
          {
            type: 'gravity',
            magnitude: mass * 9.8,
            direction: { x: 0, y: -9.8 },
            affects: ['block_1']
          }
        ],
        environment: { gravity: 9.8, friction_coefficient: friction },
        visualization_hints: {
          camera_position: { x: 0, y: height / 2 },
          zoom_level: 1,
          show_vectors: true,
          ground_level: 0
        }
      });
      return;
    }
    
    setError('Could not parse this scenario. Try using test scenarios or be more specific.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Universal Physics Simulator
        </h1>

        {/* Input Section */}
        <div className="bg-slate-900 rounded-2xl p-6 mb-6 border border-blue-500/30">
          <h2 className="text-xl font-semibold mb-4">Enter Physics Problem</h2>
          
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., A 2kg ball is thrown from a 20m building at 15 m/s horizontally"
            className="w-full h-24 bg-slate-950 border border-blue-500/50 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-blue-400"
          />
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={parseWithRules}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition"
              disabled={isLoading}
            >
              {isLoading ? 'Parsing...' : 'Parse (Rule-Based)'}
            </button>
            
            <button
              onClick={parseWithClaudeAPI}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
              disabled={isLoading}
            >
              {isLoading ? 'Parsing...' : 'Parse (Claude API)'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Test Scenarios */}
        <div className="bg-slate-900 rounded-2xl p-6 mb-6 border border-purple-500/30">
          <h2 className="text-xl font-semibold mb-4">Quick Test Scenarios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {testScenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => loadTestScenario(scenario)}
                className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-left transition border border-transparent hover:border-purple-500/50"
              >
                <div className="font-semibold text-purple-300">{scenario.name}</div>
                <div className="text-sm text-gray-400 mt-1">{scenario.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Simulation */}
        {parsedScenario && (
          <div className="mb-6">
            <UniversalPhysicsSimulator parsedScenario={parsedScenario} />
          </div>
        )}

        {/* Debug Panel */}
        {parsedScenario && (
          <div className="bg-slate-900 rounded-2xl p-6 border border-green-500/30">
            <h2 className="text-xl font-semibold mb-4 text-green-300">Parsed Scenario (Debug)</h2>
            <pre className="bg-slate-950 p-4 rounded-xl overflow-auto text-xs text-gray-300">
              {JSON.stringify(parsedScenario, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysicsSimulatorApp;
