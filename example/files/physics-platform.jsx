import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Lightbulb, TrendingUp, Zap, ArrowRight, BookOpen, Atom, Waves, Rocket, Orbit, Droplet, Home, Menu, X } from 'lucide-react';

// ==================== MULTI-PAGE APP WITH ROUTING ====================
const PhysicsLearningPlatform = () => {
  const [currentPage, setCurrentPage] = useState('home'); // home, dashboard, simulator
  const [selectedModule, setSelectedModule] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const navigateTo = (page, module = null) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setSelectedModule(module);
      setIsTransitioning(false);
      setShowMenu(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigateTo('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Atom className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              PhysicsLab
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => navigateTo('home')}
              className={`px-4 py-2 rounded-lg transition-all ${currentPage === 'home' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('dashboard')}
              className={`px-4 py-2 rounded-lg transition-all ${currentPage === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
            >
              Modules
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 p-4 animate-slideDown">
            <button 
              onClick={() => navigateTo('home')}
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 mb-2"
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('dashboard')}
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800"
            >
              Modules
            </button>
          </div>
        )}
      </nav>

      {/* Page Container with Transition */}
      <div className={`pt-20 transition-all duration-400 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
        {currentPage === 'dashboard' && <DashboardPage navigateTo={navigateTo} />}
        {currentPage === 'simulator' && <SimulatorPage module={selectedModule} navigateTo={navigateTo} />}
      </div>
    </div>
  );
};

// ==================== HOME PAGE ====================
const HomePage = ({ navigateTo }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <Lightbulb size={32} />,
      title: "AI-Powered Understanding",
      description: "Convert complex physics problems into interactive visualizations instantly"
    },
    {
      icon: <TrendingUp size={32} />,
      title: "What-If Intelligence",
      description: "Explore scenarios and understand cause-effect relationships in real-time"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Concept Insights",
      description: "Learn physics concepts through guided discovery and smart explanations"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-floatDelay" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-32 text-center">
          <div className="animate-fadeIn">
            <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-gradient">
                Physics
              </span>
              <br />
              <span className="text-white">Reimagined</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fadeInDelay">
              Transform complex physics problems into interactive visual experiences. 
              Learn through exploration, not memorization.
            </p>
            <button 
              onClick={() => navigateTo('dashboard')}
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl shadow-blue-500/50 animate-fadeInDelay2"
            >
              <span className="flex items-center gap-3">
                Start Exploring
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
            </button>
          </div>

          {/* Floating Physics Symbols */}
          <div className="absolute top-40 left-10 animate-floatSlow">
            <div className="text-6xl opacity-20">∫</div>
          </div>
          <div className="absolute top-60 right-20 animate-floatDelay">
            <div className="text-6xl opacity-20">∇</div>
          </div>
          <div className="absolute bottom-40 left-1/4 animate-float">
            <div className="text-6xl opacity-20">Σ</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredFeature(idx)}
              onMouseLeave={() => setHoveredFeature(null)}
              className={`relative p-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 transition-all duration-500 hover:scale-105 hover:border-blue-500/50 cursor-pointer ${
                hoveredFeature === idx ? 'shadow-2xl shadow-blue-500/20' : ''
              }`}
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <div className={`text-blue-400 mb-4 transition-transform duration-500 ${
                hoveredFeature === idx ? 'scale-110 rotate-12' : ''
              }`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
              
              {hoveredFeature === idx && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl animate-fadeIn" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 backdrop-blur">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Choose from multiple physics modules and start exploring today
          </p>
          <button 
            onClick={() => navigateTo('dashboard')}
            className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Explore Modules
          </button>
        </div>
      </section>
    </div>
  );
};

// ==================== DASHBOARD PAGE ====================
const DashboardPage = ({ navigateTo }) => {
  const [hoveredModule, setHoveredModule] = useState(null);
  const [animatedModules, setAnimatedModules] = useState([]);

  const modules = [
    {
      id: 'kinematics',
      title: 'Kinematics',
      icon: <Rocket size={40} />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Study motion, velocity, and acceleration',
      topics: ['Projectile Motion', 'Uniform Motion', 'Acceleration'],
      character: '🚀'
    },
    {
      id: 'projectile',
      title: 'Projectile Motion',
      icon: <TrendingUp size={40} />,
      color: 'from-purple-500 to-pink-500',
      description: 'Explore trajectories and parabolic motion',
      topics: ['Launch Angles', 'Range & Height', 'Time of Flight'],
      character: '⚾'
    },
    {
      id: 'gravitation',
      title: 'Gravitation',
      icon: <Orbit size={40} />,
      color: 'from-orange-500 to-red-500',
      description: 'Understand gravitational forces and orbits',
      topics: ['Planetary Motion', 'Gravitational Fields', 'Escape Velocity'],
      character: '🌍'
    },
    {
      id: 'fluid',
      title: 'Fluid Mechanics',
      icon: <Waves size={40} />,
      color: 'from-teal-500 to-blue-500',
      description: 'Analyze fluid flow and pressure',
      topics: ['Bernoulli Principle', 'Buoyancy', 'Viscosity'],
      character: '💧'
    },
    {
      id: 'electricity',
      title: 'Electricity',
      icon: <Zap size={40} />,
      color: 'from-yellow-500 to-orange-500',
      description: 'Explore electric fields and circuits',
      topics: ['Electric Fields', 'Circuits', 'Current & Voltage'],
      character: '⚡'
    },
    {
      id: 'thermodynamics',
      title: 'Thermodynamics',
      icon: <Droplet size={40} />,
      color: 'from-red-500 to-pink-500',
      description: 'Study heat transfer and energy systems',
      topics: ['Heat Transfer', 'Entropy', 'Thermal Expansion'],
      character: '🔥'
    }
  ];

  useEffect(() => {
    modules.forEach((_, idx) => {
      setTimeout(() => {
        setAnimatedModules(prev => [...prev, idx]);
      }, idx * 100);
    });
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Physics Modules
          </h1>
          <p className="text-xl text-gray-400">
            Choose a module to start your interactive learning journey
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, idx) => (
            <div
              key={module.id}
              onMouseEnter={() => setHoveredModule(idx)}
              onMouseLeave={() => setHoveredModule(null)}
              onClick={() => navigateTo('simulator', module)}
              className={`group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 cursor-pointer transition-all duration-500 ${
                animatedModules.includes(idx) ? 'animate-slideUp' : 'opacity-0'
              } ${hoveredModule === idx ? 'scale-105 shadow-2xl border-transparent' : ''}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              {/* Animated Character */}
              <div className={`absolute top-4 right-4 text-6xl transition-all duration-500 ${
                hoveredModule === idx ? 'scale-150 rotate-12' : 'scale-100'
              }`}>
                {module.character}
              </div>

              <div className="relative p-6">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${module.color} mb-4 transition-transform duration-500 ${
                  hoveredModule === idx ? 'scale-110 rotate-6' : ''
                }`}>
                  <div className="text-white">
                    {module.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-4">
                  {module.description}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.topics.map((topic, topicIdx) => (
                    <span 
                      key={topicIdx}
                      className={`px-3 py-1 rounded-full text-xs bg-slate-800 text-gray-300 transition-all duration-300 ${
                        hoveredModule === idx ? 'bg-slate-700' : ''
                      }`}
                      style={{ transitionDelay: `${topicIdx * 0.1}s` }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Launch Button */}
                <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  hoveredModule === idx 
                    ? `bg-gradient-to-r ${module.color} text-white` 
                    : 'bg-slate-800 text-gray-400'
                }`}>
                  <span className="flex items-center justify-center gap-2">
                    Launch Simulator
                    <ArrowRight className={`transition-transform ${hoveredModule === idx ? 'translate-x-2' : ''}`} size={18} />
                  </span>
                </button>
              </div>

              {/* Particles Effect on Hover */}
              {hoveredModule === idx && (
                <>
                  <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                  <div className="absolute top-20 right-20 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute bottom-10 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== SIMULATOR PAGE ====================
const SimulatorPage = ({ module, navigateTo }) => {
  const [problemText, setProblemText] = useState("A ball is thrown straight up with a speed of 10 m/s");
  const [physicsGraph, setPhysicsGraph] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [simulationState, setSimulationState] = useState(null);
  const [parameters, setParameters] = useState({ speed: 10, mass: 0.5, angle: 90 });
  const [insights, setInsights] = useState([]);
  const [whatIfScenarios, setWhatIfScenarios] = useState([]);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Get module-specific color
  const getModuleColor = () => {
    const colors = {
      kinematics: 'from-blue-500 to-cyan-500',
      projectile: 'from-purple-500 to-pink-500',
      gravitation: 'from-orange-500 to-red-500',
      fluid: 'from-teal-500 to-blue-500',
      electricity: 'from-yellow-500 to-orange-500',
      thermodynamics: 'from-red-500 to-pink-500'
    };
    return colors[module?.id] || 'from-blue-500 to-purple-500';
  };

  // Layer 1: Parse problem
  const parseProblem = async () => {
    setInsights([]);
    setWhatIfScenarios([]);
    
    const graph = {
      entities: [{
        id: "ball_1",
        type: "projectile",
        properties: {
          mass: { value: parameters.mass, unit: "kg", variable: true },
          position: { value: [0, 0], unit: "m" },
          velocity: { value: [0, parameters.speed], unit: "m/s", variable: true },
          angle: { value: parameters.angle, unit: "degrees", variable: true }
        }
      }],
      forces: [{
        id: "gravity",
        type: "constant_force",
        value: -9.8,
        affects: ["ball_1"],
        formula: "F = m * g"
      }],
      relationships: [
        { type: "kinematic", equations: ["v = u + at", "s = ut + 0.5at²", "v² = u² + 2as"] },
        { type: "energy", equations: ["KE = 0.5mv²", "PE = mgh", "Total = KE + PE"] }
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
          max_height_change: "4x increase (quadratic)",
          flight_time_change: "2x increase (linear)",
          energy_change: "4x increase",
          formula: "h ∝ v²"
        }
      },
      {
        id: 2,
        question: "What if mass doubles?",
        prediction: {
          max_height_change: "No change",
          flight_time_change: "No change",
          energy_change: "2x increase",
          formula: "h independent of mass"
        }
      }
    ];
    setWhatIfScenarios(scenarios);
  };

  // Layer 2: Physics Engine
  const calculateState = (t, graph) => {
    if (!graph) return null;
    const v0 = parameters.speed;
    const g = 9.8;
    const m = parameters.mass;
    
    const y = v0 * t - 0.5 * g * t * t;
    const vy = v0 - g * t;
    const ke = 0.5 * m * vy * vy;
    const pe = m * g * Math.max(0, y);
    const totalEnergy = 0.5 * m * v0 * v0;
    
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

  // Layer 4: Insights
  const generateInsights = (state, prevState) => {
    if (!state) return;
    const newInsights = [];
    
    if (state.phase === "descending" && (!prevState || prevState.phase === "ascending")) {
      newInsights.push({
        type: "concept",
        icon: "💡",
        title: "Peak Reached!",
        message: "Velocity becomes zero at the highest point - a key characteristic of projectile motion.",
        concept: "Instantaneous rest"
      });
    }
    
    if (state.time > 0.5 && state.energy_conservation && !insights.some(i => i.concept === "Energy conservation")) {
      newInsights.push({
        type: "observation",
        icon: "⚡",
        title: "Energy Conserved!",
        message: `Total energy stays constant at ${state.total_energy.toFixed(2)} J. KE converts to PE and back.`,
        concept: "Energy conservation"
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
    
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    // Grid
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
    
    const scale = 20;
    const maxHeight = graph.derived_quantities.max_height;
    const groundY = height - 60;
    
    // Ground
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, groundY, width, height - groundY);
    
    // Max height line
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
    
    // Ball
    const ballX = width / 2;
    const ballY = groundY - state.position.y * scale;
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(ballX, groundY - 5, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball gradient
    const gradient = ctx.createRadialGradient(ballX - 5, ballY - 5, 5, ballX, ballY, 15);
    gradient.addColorStop(0, '#60a5fa');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
    ctx.fill();
    
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
    
    // Info
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
    
    const keWidth = (state.kinetic_energy / state.total_energy) * barWidth;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(barX, barY, keWidth, barHeight);
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.fillText(`KE: ${state.kinetic_energy.toFixed(1)}J`, barX, barY - 3);
    
    const peWidth = (state.potential_energy / state.total_energy) * barWidth;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(barX, barY + barHeight + 5, peWidth, barHeight);
    ctx.fillText(`PE: ${state.potential_energy.toFixed(1)}J`, barX, barY + barHeight + 2);
    
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(barX, barY + (barHeight + 5) * 2, barWidth, barHeight);
    ctx.fillText(`Total: ${state.total_energy.toFixed(1)}J`, barX, barY + (barHeight + 5) * 2 - 3);
  };

  // Animation loop
  useEffect(() => {
    if (isSimulating && physicsGraph) {
      let lastState = simulationState;
      
      const animate = () => {
        const newTime = currentTime + 0.016;
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm animate-fadeIn">
          <button 
            onClick={() => navigateTo('dashboard')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Modules
          </button>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400">{module?.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${getModuleColor()}`}>
              {module?.icon}
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">{module?.title} Simulator</h1>
              <p className="text-gray-400">{module?.description}</p>
            </div>
          </div>
        </div>

        {/* Problem Input */}
        <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 mb-6 border border-blue-500/30 animate-slideUp">
          <label className="block text-sm font-semibold text-blue-300 mb-3">
            <BookOpen className="inline mr-2" size={16} />
            Natural Language Problem Input
          </label>
          <input
            type="text"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            className="w-full bg-slate-950 border border-blue-500/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
            placeholder="Enter physics problem..."
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-blue-500/30 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" size={24} />
                Dynamic Physics Engine
              </h3>
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full bg-slate-950 rounded-xl border-2 border-blue-500/30"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={isSimulating ? () => setIsSimulating(false) : handleStart}
                  className={`flex items-center gap-2 bg-gradient-to-r ${getModuleColor()} px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg`}
                >
                  {isSimulating ? <Pause size={20} /> : <Play size={20} />}
                  {isSimulating ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>
            </div>

            {/* Parameters */}
            <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-purple-500/30 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="text-purple-400" size={24} />
                What-If Intelligence
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
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
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
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    disabled={isSimulating}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Initial energy: {physicsGraph?.derived_quantities.initial_energy.toFixed(2)}J
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <h4 className="font-semibold mb-3 text-purple-300">Predictive Scenarios</h4>
                <div className="space-y-2">
                  {whatIfScenarios.map(scenario => (
                    <div key={scenario.id} className="bg-slate-800/50 rounded-xl p-3 border border-purple-500/20">
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Physics Graph */}
            <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-green-500/30 animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-semibold mb-4 text-green-300">
                Physics Graph
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
                </div>
              )}
            </div>

            {/* Insights */}
            <div className="bg-slate-900/50 backdrop-blur rounded-2xl p-6 border border-yellow-500/30 animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-400" size={24} />
                Concept Insights
              </h3>
              
              <div className="space-y-3">
                {insights.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    Start simulation for insights...
                  </p>
                ) : (
                  insights.map((insight, idx) => (
                    <div 
                      key={idx}
                      className={`bg-gradient-to-r ${
                        insight.type === 'concept' ? 'from-blue-900/30 to-blue-800/30 border-blue-500/30' :
                        'from-purple-900/30 to-purple-800/30 border-purple-500/30'
                      } p-4 rounded-xl border animate-fadeIn`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{insight.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{insight.title}</p>
                          <p className="text-xs text-gray-300 mt-1">{insight.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsLearningPlatform;
