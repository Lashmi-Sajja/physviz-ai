import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Lightbulb, TrendingUp, Zap } from 'lucide-react';

const PhysicsVisualizer = () => {
  const [problemText, setProblemText] = useState("A ball is thrown straight up with a speed of 10 m/s");
  const [physicsGraph, setPhysicsGraph] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [simulationState, setSimulationState] = useState(null);
  const [parameters, setParameters] = useState({ speed: 10, mass: 0.5, angle: 90 });
  const [insights, setInsights] = useState([]);
  const [whatIfScenarios, setWhatIfScenarios] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Layer 1: Parse problem and create physics graph
  const parseProblem = async () => {
    setInsights([]);
    setWhatIfScenarios([]);
    
    // Simulate AI parsing (in real implementation, call Claude API)
    const graph = {
      entities: [
        {
          id: "ball_1",
          type: "projectile",
          properties: {
            mass: { value: parameters.mass, unit: "kg", variable: true },
            position: { value: [0, 0], unit: "m" },
            velocity: { value: [0, parameters.speed], unit: "m/s", variable: true },
            angle: { value: parameters.angle, unit: "degrees", variable: true }
          }
        }
      ],
      forces: [
        {
          id: "gravity",
          type: "constant_force",
          value: -9.8,
          affects: ["ball_1"],
          formula: "F = m * g"
        }
      ],
      relationships: [
        {
          type: "kinematic",
          equations: ["v = u + at", "s = ut + 0.5at²", "v² = u² + 2as"]
        },
        {
          type: "energy",
          equations: ["KE = 0.5mv²", "PE = mgh", "Total = KE + PE"]
        }
      ],
      physics_concepts: ["projectile_motion", "energy_conservation", "kinematics"],
      derived_quantities: {
        max_height: (parameters.speed * parameters.speed) / (2 * 9.8),
        time_to_peak: parameters.speed / 9.8,
        total_flight_time: (2 * parameters.speed) / 9.8,
        initial_energy: 0.5 * parameters.mass * parameters.speed * parameters.speed
      }
    };
    
    setPhysicsGraph(graph);
    
    // Generate What-If scenarios
    generateWhatIfScenarios(graph);
    
    return graph;
  };

  // Layer 3: What-If Intelligence
  const generateWhatIfScenarios = (graph) => {
    const scenarios = [
      {
        id: 1,
        question: "What if speed doubles?",
        prediction: {
          max_height_change: "4x increase (quadratic relationship)",
          flight_time_change: "2x increase (linear relationship)",
          energy_change: "4x increase",
          formula: "h ∝ v²"
        },
        originalValue: parameters.speed,
        newValue: parameters.speed * 2
      },
      {
        id: 2,
        question: "What if mass doubles?",
        prediction: {
          max_height_change: "No change (mass cancels out)",
          flight_time_change: "No change",
          energy_change: "2x increase",
          formula: "h = v²/(2g), independent of mass"
        },
        originalValue: parameters.mass,
        newValue: parameters.mass * 2
      },
      {
        id: 3,
        question: "How to reach 20m height?",
        prediction: {
          required_speed: Math.sqrt(2 * 9.8 * 20).toFixed(2) + " m/s",
          calculation: "v = √(2gh) = √(2 × 9.8 × 20)",
          energy_required: (0.5 * parameters.mass * 2 * 9.8 * 20).toFixed(2) + " J"
        }
      }
    ];
    
    setWhatIfScenarios(scenarios);
  };

  // Layer 2: Dynamic Physics Engine
  const calculateState = (t, graph) => {
    if (!graph) return null;

    const v0 = parameters.speed;
    const g = 9.8;
    const m = parameters.mass;
    
    // Position and velocity at time t
    const y = v0 * t - 0.5 * g * t * t;
    const vy = v0 - g * t;
    
    // Energy calculations
    const ke = 0.5 * m * vy * vy;
    const pe = m * g * Math.max(0, y);
    const totalEnergy = 0.5 * m * v0 * v0;
    
    // Determine phase
    const peakTime = v0 / g;
    let phase = "ascending";
    if (t >= peakTime && y > 0) phase = "descending";
    if (y <= 0 && t > 0.1) phase = "landed";
    
    return {
      time: t,
      position: { x: 0, y: Math.max(0, y) },
      velocity: { x: 0, y: vy },
      acceleration: { x: 0, y: -g },
      kinetic_energy: ke,
      potential_energy: pe,
      total_energy: totalEnergy,
      energy_conservation: Math.abs(ke + pe - totalEnergy) < 0.1,
      phase: phase,
      speed: Math.abs(vy),
      height_percentage: (y / graph.derived_quantities.max_height) * 100
    };
  };

  // Layer 4: Concept Insights
  const generateInsights = (state, prevState) => {
    if (!state) return;
    
    const newInsights = [];
    
    // Peak detection
    if (state.phase === "descending" && (!prevState || prevState.phase === "ascending")) {
      newInsights.push({
        type: "concept",
        icon: "💡",
        title: "Peak Reached!",
        message: "Notice: Velocity becomes zero at the highest point. This is a key characteristic of projectile motion.",
        concept: "Instantaneous rest at turning point"
      });
    }
    
    // Energy conservation
    if (state.time > 0.5 && state.energy_conservation) {
      const energyInsightExists = insights.some(i => i.concept === "Energy conservation");
      if (!energyInsightExists) {
        newInsights.push({
          type: "observation",
          icon: "⚡",
          title: "Energy is Conserved!",
          message: `Total energy stays constant at ${state.total_energy.toFixed(2)} J. As the ball rises, KE converts to PE.`,
          concept: "Energy conservation"
        });
      }
    }
    
    // Symmetry
    if (state.phase === "landed" && state.time > 0.5) {
      newInsights.push({
        type: "discovery",
        icon: "🎯",
        title: "Symmetry Observed",
        message: `Landing speed equals launch speed (${parameters.speed.toFixed(1)} m/s). Projectile motion is symmetric!`,
        concept: "Time symmetry"
      });
    }
    
    // Acceleration constant
    if (state.time === 0.5 && insights.length === 0) {
      newInsights.push({
        type: "fundamental",
        icon: "📊",
        title: "Constant Acceleration",
        message: "Acceleration remains constant at -9.8 m/s² throughout the motion. This is gravity!",
        concept: "Uniform acceleration"
      });
    }
    
    if (newInsights.length > 0) {
      setInsights(prev => [...prev, ...newInsights]);
    }
  };

  // Canvas rendering
  const drawSimulation = (state, graph) => {
    const canvas = canvasRef.current;
    if (!canvas || !state || !graph) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Scale factor (pixels per meter)
    const scale = 20;
    const maxHeight = graph.derived_quantities.max_height;
    const groundY = height - 60;
    
    // Draw ground
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, groundY, width, height - groundY);
    
    // Draw max height indicator
    const maxHeightY = groundY - maxHeight * scale;
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, maxHeightY);
    ctx.lineTo(width, maxHeightY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#fbbf24';
    ctx.font = '12px monospace';
    ctx.fillText(`Max: ${maxHeight.toFixed(2)}m`, 10, maxHeightY - 5);
    
    // Draw ball
    const ballX = width / 2;
    const ballY = groundY - state.position.y * scale;
    
    // Ball shadow (for depth perception)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(ballX, groundY - 5, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball
    const gradient = ctx.createRadialGradient(ballX - 5, ballY - 5, 5, ballX, ballY, 15);
    gradient.addColorStop(0, '#60a5fa');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BALL', ballX, ballY + 4);
    
    // Velocity vector
    if (Math.abs(state.velocity.y) > 0.5) {
      const velocityScale = 3;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX, ballY - state.velocity.y * velocityScale);
      ctx.stroke();
      
      // Arrow head
      const arrowY = ballY - state.velocity.y * velocityScale;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(ballX, arrowY);
      ctx.lineTo(ballX - 5, arrowY + (state.velocity.y > 0 ? 10 : -10));
      ctx.lineTo(ballX + 5, arrowY + (state.velocity.y > 0 ? 10 : -10));
      ctx.fill();
      
      ctx.fillStyle = '#ef4444';
      ctx.font = '11px monospace';
      ctx.fillText(`v=${state.velocity.y.toFixed(1)} m/s`, ballX + 50, ballY - state.velocity.y * velocityScale);
    }
    
    // Current height indicator
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Height: ${state.position.y.toFixed(2)}m`, 10, 20);
    ctx.fillText(`Time: ${state.time.toFixed(2)}s`, 10, 35);
    ctx.fillText(`Phase: ${state.phase}`, 10, 50);
    
    // Energy bars
    const barX = width - 150;
    const barY = 20;
    const barWidth = 120;
    const barHeight = 15;
    
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(barX, barY, barWidth, barHeight * 3 + 20);
    
    // KE bar
    const keWidth = (state.kinetic_energy / state.total_energy) * barWidth;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(barX, barY, keWidth, barHeight);
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.fillText(`KE: ${state.kinetic_energy.toFixed(1)}J`, barX, barY - 3);
    
    // PE bar
    const peWidth = (state.potential_energy / state.total_energy) * barWidth;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(barX, barY + barHeight + 5, peWidth, barHeight);
    ctx.fillText(`PE: ${state.potential_energy.toFixed(1)}J`, barX, barY + barHeight + 2);
    
    // Total energy bar
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(barX, barY + (barHeight + 5) * 2, barWidth, barHeight);
    ctx.fillText(`Total: ${state.total_energy.toFixed(1)}J`, barX, barY + (barHeight + 5) * 2 - 3);
  };

  // Animation loop
  useEffect(() => {
    if (isSimulating && physicsGraph) {
      let lastState = simulationState;
      
      const animate = () => {
        const newTime = currentTime + 0.016; // ~60fps
        const maxTime = physicsGraph.derived_quantities.total_flight_time;
        
        if (newTime > maxTime + 0.5) {
          setIsSimulating(false);
          return;
        }
        
        const newState = calculateState(newTime, physicsGraph);
        setSimulationState(newState);
        setCurrentTime(newTime);
        
        generateInsights(newState, lastState);
        drawSimulation(newState, physicsGraph);
        
        lastState = newState;
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSimulating, currentTime, physicsGraph]);

  // Initialize
  useEffect(() => {
    parseProblem();
  }, [parameters]);

  useEffect(() => {
    if (physicsGraph && !isSimulating) {
      const initialState = calculateState(0, physicsGraph);
      setSimulationState(initialState);
      drawSimulation(initialState, physicsGraph);
    }
  }, [physicsGraph]);

  const handleStart = () => {
    setCurrentTime(0);
    setInsights([]);
    setIsSimulating(true);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsSimulating(false);
    setInsights([]);
    if (physicsGraph) {
      const initialState = calculateState(0, physicsGraph);
      setSimulationState(initialState);
      drawSimulation(initialState, physicsGraph);
    }
  };

  const handleParameterChange = (param, value) => {
    setParameters(prev => ({ ...prev, [param]: parseFloat(value) }));
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Physics Problem Visualizer
          </h1>
          <p className="text-blue-200 text-lg">
            Text → Physics Graph → Dynamic Engine → What-If Intelligence → Insights
          </p>
        </div>

        {/* Problem Input */}
        <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 mb-6 border border-blue-500/30">
          <label className="block text-sm font-semibold text-blue-300 mb-2">
            Layer 1: Natural Language Problem Input
          </label>
          <input
            type="text"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            className="w-full bg-slate-900 border border-blue-500/50 rounded px-4 py-3 text-white"
            placeholder="Enter physics problem..."
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel - Visualization */}
          <div className="col-span-2 space-y-6">
            {/* Canvas */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" size={24} />
                Layer 2: Dynamic Physics Engine
              </h3>
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full bg-slate-950 rounded border-2 border-blue-500/30"
              />
              
              {/* Controls */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={isSimulating ? () => setIsSimulating(false) : handleStart}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold transition"
                >
                  {isSimulating ? <Pause size={20} /> : <Play size={20} />}
                  {isSimulating ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded font-semibold transition"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>
            </div>

            {/* Parameters - Layer 3 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="text-purple-400" size={24} />
                Layer 3: What-If Intelligence - Real-Time Parameters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-300 mb-2">
                    Initial Speed: {parameters.speed.toFixed(1)} m/s
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={parameters.speed}
                    onChange={(e) => handleParameterChange('speed', e.target.value)}
                    className="w-full"
                    disabled={isSimulating}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Max height: {physicsGraph?.derived_quantities.max_height.toFixed(2)}m | 
                    Flight time: {physicsGraph?.derived_quantities.total_flight_time.toFixed(2)}s
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-300 mb-2">
                    Mass: {parameters.mass.toFixed(2)} kg
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={parameters.mass}
                    onChange={(e) => handleParameterChange('mass', e.target.value)}
                    className="w-full"
                    disabled={isSimulating}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Initial energy: {physicsGraph?.derived_quantities.initial_energy.toFixed(2)}J
                  </p>
                </div>
              </div>

              {/* What-If Scenarios */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="font-semibold mb-3 text-purple-300">Predictive What-If Scenarios</h4>
                <div className="space-y-2">
                  {whatIfScenarios.slice(0, 2).map(scenario => (
                    <div key={scenario.id} className="bg-slate-900/50 rounded p-3 border border-purple-500/20">
                      <p className="font-semibold text-sm text-purple-200">{scenario.question}</p>
                      <div className="text-xs text-gray-300 mt-2 space-y-1">
                        {Object.entries(scenario.prediction).map(([key, value]) => (
                          <p key={key}>• {key.replace(/_/g, ' ')}: {value}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Insights */}
          <div className="space-y-6">
            {/* Physics Graph */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-green-500/30">
              <h3 className="text-lg font-semibold mb-4 text-green-300">
                Layer 1: Structured Physics Graph
              </h3>
              {physicsGraph && (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-green-200">Concepts:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {physicsGraph.physics_concepts.map(concept => (
                        <span key={concept} className="bg-green-900/30 px-2 py-1 rounded text-xs">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-green-200">Forces:</p>
                    <p className="text-xs text-gray-300">{physicsGraph.forces[0].formula}</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-green-200">Key Equations:</p>
                    <div className="text-xs text-gray-300 space-y-1">
                      {physicsGraph.relationships[0].equations.map((eq, i) => (
                        <p key={i}>• {eq}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Insights - Layer 4 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-yellow-500/30">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-400" size={24} />
                Layer 4: Concept Insights
              </h3>
              
              <div className="space-y-3">
                {insights.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    Start the simulation to see real-time insights...
                  </p>
                ) : (
                  insights.map((insight, idx) => (
                    <div 
                      key={idx}
                      className={`bg-gradient-to-r ${
                        insight.type === 'concept' ? 'from-blue-900/30 to-blue-800/30 border-blue-500/30' :
                        insight.type === 'observation' ? 'from-purple-900/30 to-purple-800/30 border-purple-500/30' :
                        insight.type === 'discovery' ? 'from-green-900/30 to-green-800/30 border-green-500/30' :
                        'from-yellow-900/30 to-yellow-800/30 border-yellow-500/30'
                      } p-4 rounded border`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{insight.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{insight.title}</p>
                          <p className="text-xs text-gray-300 mt-1">{insight.message}</p>
                          <p className="text-xs text-gray-400 mt-2 italic">
                            Concept: {insight.concept}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Suggested Experiments */}
              {insights.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h4 className="font-semibold mb-3 text-yellow-300">Try This Challenge:</h4>
                  <div className="bg-slate-900/50 rounded p-3 text-sm space-y-2">
                    <p>1. Set speed to 20 m/s and observe max height</p>
                    <p>2. Now try 10 m/s. What's the relationship?</p>
                    <p>3. Change mass. Does it affect the motion?</p>
                  </div>
                </div>
              )}
            </div>

            {/* State Information */}
            {simulationState && (
              <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 border border-blue-500/30">
                <h4 className="font-semibold mb-3">Current State</h4>
                <div className="text-xs space-y-1 font-mono text-gray-300">
                  <p>Position: ({simulationState.position.x.toFixed(2)}, {simulationState.position.y.toFixed(2)}) m</p>
                  <p>Velocity: {simulationState.velocity.y.toFixed(2)} m/s</p>
                  <p>Speed: {simulationState.speed.toFixed(2)} m/s</p>
                  <p>KE: {simulationState.kinetic_energy.toFixed(2)} J</p>
                  <p>PE: {simulationState.potential_energy.toFixed(2)} J</p>
                  <p>Total: {simulationState.total_energy.toFixed(2)} J</p>
                  <p className="pt-2 text-green-400">
                    ✓ Energy conserved: {simulationState.energy_conservation ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-blue-300">
          <p>🚀 Full 4-Layer Physics Intelligence System | Built for STEM Learning</p>
        </div>
      </div>
    </div>
  );
};

export default PhysicsVisualizer;
