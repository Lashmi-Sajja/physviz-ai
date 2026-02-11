# PhysicsViz - Quick Reference

## Project Summary
AI-powered system that converts physics word problems into interactive visual simulations for STEM education.

## Tech Stack
- **Backend**: Python Flask + OpenAI API
- **Frontend**: HTML/CSS/JavaScript + p5.js
- **Physics**: Kinematic equations

## Key Features
1. Natural language problem input
2. AI parameter extraction
3. Real-time visualization
4. Interactive parameter control
5. Instant visual feedback

## Supported Scenarios
- Projectile motion
- Vertical projectile
- Free fall
- Horizontal motion

## Quick Start
```bash
# Setup
pip install flask flask-cors openai python-dotenv
export OPENAI_API_KEY="your-key"

# Run
python backend/app.py

# Access
http://localhost:5000
```

## Example Input
"A ball is thrown straight up with a speed of 10 m/s"

## Example Output
- Animated ball trajectory
- Real-time height/time display
- Adjustable velocity/angle sliders

## Development Time
3 hours total:
- Backend: 45 min
- Frontend: 30 min
- Visualization: 60 min
- Testing: 45 min

## API Endpoint
```
POST /api/parse
Body: {"problem": "text"}
Response: {"success": true, "data": {...}}
```

## File Structure
```
vnrvc/
├── backend/
│   ├── app.py
│   ├── physics.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── docs/
    ├── README.md
    ├── API.md
    ├── ARCHITECTURE.md
    ├── IMPLEMENTATION.md
    ├── PRESENTATION.md
    └── QUICKREF.md
```

## Physics Equations
```
x(t) = x₀ + v₀ₓ * t
y(t) = y₀ + v₀ᵧ * t - 0.5 * g * t²
vₓ(t) = v₀ₓ
vᵧ(t) = v₀ᵧ - g * t
```

## Demo Flow
1. Enter problem text
2. Click "Visualize"
3. Watch animation
4. Adjust sliders
5. Observe changes

## Presentation Points
- Solves real educational problem
- AI-powered understanding
- Interactive learning
- Built in 3 hours
- Extensible architecture

## Future Enhancements
- Collision physics
- Multiple objects
- 3D visualization
- Force diagrams
- Mobile support
- Save/share features

## Contact & Links
- GitHub: [repository]
- Demo: [live link]
- Team: [team name]

## License
MIT License

---
Built for [Hackathon Name] - February 2026
