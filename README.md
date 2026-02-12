# PhysicsViz - AI-Powered Physics Problem Visualizer

Transform physics word problems into interactive visual simulations

prototype video link -> https://drive.google.com/file/d/154Q-hzrDMHKcN1r0Kxz1gY287qPtsey0/view?usp=drivesdk

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python server.py

# Open browser
http://localhost:5000
```

## Features

### 3 Physics Modules (Implemented)
1. **Projectile Motion** - Launch objects at angles
2. **Free Fall** - Drop objects from heights  
3. **Friction** - Sliding with resistance

### Core Capabilities
- Visual scenario selector
- Real-time parameter adjustment
- Interactive canvas visualization
- Physics insights during simulation
- What-If scenario predictions
- Modular architecture for easy expansion

## Project Structure

```
physviz-ai/
├── src/
│   ├── core/              # Core architecture
│   ├── scenarios/         # Physics modules
│   ├── index.html         # Main UI
│   ├── styles.css         # Styling
│   └── app.js            # Application logic
├── docs/                  # Documentation
├── example/              # React prototype
├── server.py             # Flask server
└── requirements.txt      # Dependencies
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
- Each module is independent and pluggable

### Adding New Modules
See `QUICKSTART.md` for detailed instructions on adding new physics scenarios.

## Documentation

- `docs/MODULES.md` - Complete list of 14 planned physics modules
- `docs/ARCHITECTURE.md` - System architecture details
- `docs/IMPLEMENTATION.md` - Implementation guide
- `QUICKSTART.md` - Development guide

## Roadmap

### Phase 1 (Current)
- Modular architecture
- 3 core physics modules
- Scenario selector UI

### Phase 2 (Next)
- AI problem parsing with LLM
- 11 more physics modules
- Backend integration

### Phase 3 (Future)
- Save/share simulations
- Multiple object interactions
- 3D visualizations

## Tech Stack

- **Frontend:** Vanilla JS (ES6 modules), HTML5 Canvas
- **Backend:** Flask (Python)
- **AI:** OpenAI/Gemini (planned)
- **Styling:** Modern CSS with gradients

## License

MIT License

## Built for Vibe Coding Hackathon

Problem Statement: Create an AI-powered system that converts physics word problems into interactive visual simulations for STEM education.
