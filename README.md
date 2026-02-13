# PhysViz AI - AI-Powered Physics Learning Platform

Transform physics word problems into interactive visual simulations

Prototype video link → https://drive.google.com/file/d/154Q-hzrDMHKcN1r0Kxz1gY287qPtsey0/view?usp=drivesdk

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment (for AI parsing)
cp .env.example .env
# Add your GROQ_API_KEY to .env file

# Run server
python server.py

# Open browser
http://localhost:5000
```

### Get Groq API Key (Free)
1. Visit https://console.groq.com/keys
2. Sign up for free account
3. Create new API key
4. Add to `.env` file: `GROQ_API_KEY=your_key_here`

Note: App works without API key using "Quick Start" button, but AI problem parsing requires the key.

## Features

### 5 Physics Modules (Implemented)
1. **Projectile Motion** - Launch objects at angles
2. **Vertical Projectile** - Throw objects straight up
3. **Free Fall** - Drop objects from heights  
4. **Friction** - Sliding with resistance
5. **Relative Velocity** - Motion in moving mediums

### Core Capabilities
- Landing page with animated hero section
- Visual module selector with progress tracking
- **AI-powered problem parsing** using Groq LLM (Llama 3.3 70B)
- Real-time parameter adjustment with sliders
- Interactive P5.js canvas visualization
- Physics insights during simulation
- Graph rendering for motion analysis
- Modular architecture for easy expansion

## Project Structure

```
physviz-ai/
├── src/
│   ├── core/                    # Core architecture
│   │   ├── BaseScenario.js      # Abstract base class
│   │   ├── ScenarioManager.js   # Module loader
│   │   ├── P5PhysicsRenderer.js # P5.js rendering engine
│   │   └── GraphRenderer.js     # Graph visualization
│   ├── scenarios/               # Physics modules
│   │   ├── ProjectileMotion.js
│   │   ├── FreeFall.js
│   │   └── Friction.js
│   ├── kiro.html                # Main UI
│   ├── kiro-styles.css          # Styling
│   ├── kiro-app.js              # Application logic
│   ├── test.html                # Testing page
│   └── debug.html               # Debug utilities
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md
│   ├── MODULES.md
│   ├── API.md
│   ├── ANIMATIONS.md
│   └── Problem_Statement.md
├── server.py                    # Flask server
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
└── LICENSE                      # MIT License
```

## How to Use

1. **Select a physics module** from the grid
2. **Enter a problem** or click "Quick Start"
3. **Adjust parameters** with sliders
4. **Start simulation** and watch the animation
5. **View insights** and what-if scenarios in real-time

## Architecture

### Modular Design
- `BaseScenario` - Abstract class for all physics modules
- `ScenarioManager` - Handles scenario loading and rendering
- `P5PhysicsRenderer` - P5.js-based rendering engine
- `GraphRenderer` - Motion analysis graphs
- Each module is independent and pluggable

### Current Modules
All modules extend `BaseScenario` and implement:
- `getParameters()` - Define adjustable parameters
- `calculate()` - Physics calculations
- `draw()` - Custom rendering logic

## Documentation

- `docs/MODULES.md` - Complete list of implemented physics modules
- `docs/ARCHITECTURE.md` - System architecture details
- `docs/API.md` - API documentation
- `docs/ANIMATIONS.md` - Animation system guide
- `docs/Problem_Statement.md` - Original problem statement

## Tech Stack

- **Frontend:** Vanilla JS (ES6 modules), P5.js, HTML5 Canvas
- **Backend:** Flask (Python)
- **Styling:** Modern CSS with gradients and animations

## License

MIT License

## Built for Vibe Coding Hackathon

Problem Statement: Create an AI-powered system that converts physics word problems into interactive visual simulations for STEM education.
