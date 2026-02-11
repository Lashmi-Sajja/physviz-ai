# Implementation Guide

## Development Timeline (3 Hours)

### Phase 1: Setup & Backend (45 minutes)

#### Step 1: Project Structure (5 min)
```bash
mkdir -p backend frontend
cd backend
touch app.py physics.py requirements.txt
cd ../frontend
touch index.html style.css script.js
```

#### Step 2: Install Dependencies (5 min)
```bash
# backend/requirements.txt
flask==3.0.0
flask-cors==4.0.0
openai==1.0.0
python-dotenv==1.0.0

# Install
pip install -r requirements.txt
```

#### Step 3: Backend Implementation (35 min)

**app.py** - Core Flask application
```python
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__, static_folder='../frontend')
CORS(app)

openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/api/parse', methods=['POST'])
def parse_problem():
    data = request.json
    problem = data.get('problem', '')
    
    prompt = f"""Extract physics parameters from this problem. Return ONLY valid JSON:
    
Problem: {problem}

Return format:
{{
  "scenario": "projectile|vertical_projectile|free_fall|horizontal",
  "object": "ball|block|etc",
  "initial_velocity": number,
  "angle": number (0-90),
  "gravity": 9.8,
  "initial_height": number
}}"""

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        result = response.choices[0].message.content
        import json
        parsed = json.loads(result)
        return jsonify({"success": True, "data": parsed})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### Phase 2: Frontend Structure (30 minutes)

#### Step 4: HTML Layout (10 min)

**index.html** - Minimal structure
```html
<!DOCTYPE html>
<html>
<head>
    <title>PhysicsViz</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
</head>
<body>
    <div class="container">
        <h1>PhysicsViz</h1>
        <textarea id="problem" placeholder="Enter physics problem..."></textarea>
        <button onclick="visualize()">Visualize</button>
        
        <div id="controls" style="display:none;">
            <label>Velocity: <input type="range" id="velocity" min="1" max="50" value="10"></label>
            <label>Angle: <input type="range" id="angle" min="0" max="90" value="90"></label>
            <button onclick="resetSim()">Reset</button>
        </div>
        
        <div id="canvas-container"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

#### Step 5: CSS Styling (10 min)

**style.css** - Clean, minimal design
```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f5f5f5;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
}

h1 {
    color: #333;
}

textarea {
    width: 100%;
    height: 80px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px 5px 10px 0;
}

button:hover {
    background: #0056b3;
}

#controls {
    margin: 20px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

#controls label {
    display: block;
    margin: 10px 0;
}

#controls input[type="range"] {
    width: 200px;
    margin-left: 10px;
}
```

### Phase 3: Visualization Logic (60 minutes)

#### Step 6: p5.js Physics Engine (60 min)

**script.js** - Complete implementation
```javascript
let simData = null;
let t = 0;
let isRunning = false;
let x, y, vx, vy;

function visualize() {
    const problem = document.getElementById('problem').value;
    
    fetch('http://localhost:5000/api/parse', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({problem})
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            simData = data.data;
            document.getElementById('controls').style.display = 'block';
            document.getElementById('velocity').value = simData.initial_velocity;
            document.getElementById('angle').value = simData.angle;
            initSimulation();
        }
    });
}

function initSimulation() {
    if (!simData) return;
    
    const v0 = parseFloat(document.getElementById('velocity').value);
    const angle = parseFloat(document.getElementById('angle').value);
    const rad = angle * Math.PI / 180;
    
    vx = v0 * Math.cos(rad);
    vy = -v0 * Math.sin(rad);
    x = 50;
    y = 500;
    t = 0;
    isRunning = true;
}

function setup() {
    const canvas = createCanvas(800, 600);
    canvas.parent('canvas-container');
}

function draw() {
    background(240);
    
    // Ground
    stroke(0);
    line(0, 550, 800, 550);
    
    if (!isRunning) return;
    
    // Physics
    const dt = 0.016;
    const g = 9.8;
    const scale = 5;
    
    x += vx * scale * dt * 60;
    y += vy * scale * dt * 60;
    vy += g * scale * dt * 60;
    
    // Collision
    if (y >= 500) {
        y = 500;
        vy = 0;
        vx = 0;
    }
    
    // Draw ball
    fill(255, 0, 0);
    noStroke();
    circle(x, y, 20);
    
    // Info
    fill(0);
    text(`Time: ${(t).toFixed(2)}s`, 10, 20);
    text(`Height: ${((550-y)/scale).toFixed(1)}m`, 10, 40);
    
    t += dt;
}

function resetSim() {
    initSimulation();
}

// Update on slider change
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('velocity').addEventListener('input', initSimulation);
    document.getElementById('angle').addEventListener('input', initSimulation);
});
```

### Phase 4: Testing & Polish (45 minutes)

#### Step 7: Test Cases (20 min)

Test with these problems:
1. "A ball is thrown straight up with a speed of 10 m/s"
2. "A projectile is launched at 45 degrees with velocity 20 m/s"
3. "An object is dropped from 50 meters"

#### Step 8: Bug Fixes (15 min)
- Check API responses
- Verify physics calculations
- Test slider interactions

#### Step 9: Demo Preparation (10 min)
- Prepare 2-3 example problems
- Test end-to-end flow
- Note any limitations

## Quick Start Commands

```bash
# Terminal 1: Start backend
cd backend
export OPENAI_API_KEY="your-key-here"
python app.py

# Terminal 2: Open browser
open http://localhost:5000
```

## Common Issues & Fixes

### Issue: CORS Error
**Fix:** Ensure `flask-cors` is installed and CORS(app) is called

### Issue: LLM Returns Invalid JSON
**Fix:** Add JSON validation and retry logic

### Issue: Animation Too Fast/Slow
**Fix:** Adjust scale factor in physics calculations

### Issue: Ball Goes Off Screen
**Fix:** Add boundary checks in draw() function

## Optimization Tips

1. **Cache LLM responses** for identical problems
2. **Debounce slider inputs** to reduce re-renders
3. **Use requestAnimationFrame** instead of setInterval
4. **Minimize API calls** during parameter adjustments

## Demo Script

1. Show interface
2. Enter: "A ball is thrown up at 15 m/s"
3. Click Visualize
4. Adjust velocity slider
5. Show real-time updates
6. Reset and try different angle

## Presentation Points

- AI extracts parameters automatically
- Real-time interactive visualization
- Simple, intuitive interface
- Extensible to more scenarios
- Built in 3 hours!
