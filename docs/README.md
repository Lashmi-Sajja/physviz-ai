# PhysicsViz - AI-Powered Physics Problem Visualizer

## Overview
PhysicsViz is an AI-powered system that converts physics word problems into interactive visual simulations, helping STEM learners bridge the gap between textual problem statements and conceptual understanding.

## Problem Statement
STEM learners often struggle to understand complex word problems because they require mental visualization of abstract concepts such as motion, shapes, forces, or relationships. Existing learning tools largely rely on static text or equations, limiting intuitive understanding and exploration.

## Solution
An intelligent system that:
- Accepts physics word problems as natural language input
- Automatically extracts key entities and parameters using AI
- Generates interactive visual simulations
- Enables real-time parameter manipulation
- Provides instant visual feedback for "what-if" scenarios

## Key Features

### 1. Natural Language Processing
- AI-based understanding of physics problem statements
- Extraction of entities (objects, forces, constraints)
- Parameter identification (velocity, angle, mass, etc.)

### 2. Visual Simulation
- Dynamic, interactive visualizations
- Simple geometric representations (dots with labels)
- Real-time animation based on physics equations

### 3. Interactive Controls
- Adjustable parameters via sliders
- Play/pause/reset functionality
- Instant visual feedback on parameter changes

### 4. Supported Physics Scenarios
- Projectile motion
- Free fall
- Horizontal motion
- Vertical motion

## Technology Stack

### Backend
- **Python Flask**: Lightweight web framework
- **OpenAI/Gemini API**: Natural language understanding
- **JSON**: Data exchange format

### Frontend
- **HTML5/CSS3**: User interface
- **JavaScript**: Interactivity
- **p5.js**: Canvas-based visualization and animation

### Physics Engine
- Custom kinematic equations implementation
- Real-time position and velocity calculations

## Architecture

```
User Input (Text) 
    ↓
Flask API Endpoint
    ↓
LLM Processing (Extract Parameters)
    ↓
JSON Response (Structured Data)
    ↓
Frontend Visualization (p5.js)
    ↓
Interactive Simulation
```

## Example Usage

**Input:**
```
A ball is thrown straight up with a speed of 10 m/s. Visualize the motion of the ball.
```

**AI Extraction:**
```json
{
  "scenario": "vertical_projectile",
  "object": "ball",
  "initial_velocity": 10,
  "angle": 90,
  "gravity": 9.8
}
```

**Output:**
- Animated ball moving upward, decelerating, and falling back down
- Sliders to adjust initial velocity
- Real-time trajectory visualization

## Project Structure
```
vnrvc/
├── docs/               # Documentation
├── backend/            # Flask API
│   ├── app.py         # Main application
│   ├── physics.py     # Physics calculations
│   └── requirements.txt
├── frontend/           # Web interface
│   ├── index.html     # Main page
│   ├── style.css      # Styling
│   └── script.js      # Visualization logic
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- API key (OpenAI/Gemini)
- Modern web browser

### Quick Start
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Set API key
export OPENAI_API_KEY="your-api-key"

# Run server
python backend/app.py

# Open browser
http://localhost:5000
```

## Future Enhancements
- Support for more complex physics scenarios (collisions, pendulums)
- Multiple object interactions
- 3D visualizations
- Save/share simulations
- Educational hints and explanations
- Mobile responsive design

## Team
[Your Team Name]

## License
MIT License
