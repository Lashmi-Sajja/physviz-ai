# Demo Guide for Presentation

## Quick Demo Flow (5 minutes)

### 1. Landing Page (30 sec)
- Show the clean, modern UI
- Highlight the tagline: "AI-Powered Physics Problem Visualizer"
- Click "Start Learning"

### 2. Module Selection (30 sec)
- Show 5 physics modules in grid layout:
  - Projectile Motion
  - Free Fall
  - Friction
  - **Inclined Plane** (NEW)
  - **River Crossing** (NEW)

### 3. Demo Inclined Plane (2 min)
- Click "Inclined Plane"
- Show the visualization:
  - Block sliding down slope
  - Angle indicator
  - Real-time distance/velocity display
- **Adjust sliders live:**
  - Increase angle → faster acceleration
  - Increase friction → slower motion
- **Show insights panel:**
  - "Forces Combined! Gravity and friction affect acceleration"
- **Show what-if scenarios:**
  - "At 45° angle: a = X m/s²"

### 4. Demo River Crossing (2 min)
- Click back, select "River Crossing"
- Show the visualization:
  - Animated river with flow lines
  - Boat moving across
  - Velocity vectors displayed
- **Adjust sliders live:**
  - Increase current → more drift
  - Change angle → different path
- **Show insights:**
  - "Relative Motion! Boat velocity and river current combine as vectors"
- **Show what-if:**
  - "Total drift when crossing: X m"
  - "To go straight across, aim at Y° upstream"

## Key Points to Emphasize

### Technical Excellence
- **Modular Architecture**: Each physics concept is a pluggable module
- **Real-time Rendering**: Smooth 60fps canvas animations
- **Interactive Learning**: Students explore, not just watch

### Educational Impact
- **Visual Understanding**: Abstract concepts become concrete
- **What-If Exploration**: Students can experiment safely
- **Instant Feedback**: See physics in action immediately

### Scalability
- **5 modules implemented** (started with 3, added 2 today)
- **Architecture supports 14+ modules** easily
- **AI-ready backend** for future problem parsing

## Backup Talking Points

### If asked about AI integration:
"The backend is Flask-ready for LLM integration. We'll add OpenAI/Gemini to parse natural language problems and automatically detect scenario types."

### If asked about other modules:
"We focused on 2D motion - projectile, inclined plane, river crossing. The architecture makes adding circular motion, waves, or thermodynamics straightforward."

### If asked about target users:
"High school and college physics students who struggle with abstract word problems. This makes physics intuitive through interaction."

## Demo URLs
- **Local**: http://localhost:5000
- **Landing**: Click "Start Learning"
- **Modules**: Auto-loads after landing
- **Simulation**: Click any module card

## Troubleshooting
- If server not running: `python server.py`
- If port busy: Check `ps aux | grep python` and kill process
- Browser: Use Chrome/Firefox for best canvas performance
