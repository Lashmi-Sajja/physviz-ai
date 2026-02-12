from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='src')
CORS(app)

@app.route('/')
def index():
    return send_from_directory('src', 'kiro.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('src', path)

@app.route('/api/parse', methods=['POST'])
def parse_problem():
    try:
        data = request.json
        problem = data.get('problem', '')
        
        print(f"Received problem: {problem}")  # Debug log
        
        if not problem:
            return jsonify({"success": False, "error": "No problem provided"}), 400
        
        api_key = os.getenv('GROQ_API_KEY', '')
        print(f"API key present: {bool(api_key)}")  # Debug log
        
        if not api_key:
            return jsonify({"success": False, "error": "API key not configured. Add GROQ_API_KEY to .env file"}), 500
        
        # Create prompt for LLM
        prompt = f"""Extract physics parameters from this problem and return ONLY valid JSON.

Problem: {problem}

Identify the scenario type and extract relevant parameters:

SCENARIO RULES:
1. "projectile_motion" - Ball/object thrown at an angle (not straight up/down)
   Required: velocity (m/s), angle (degrees, 1-89)
   
2. "free_fall" - Ball/object dropped or falling straight down
   Required: height (meters)
   
3. "friction" - Block/object sliding on a surface with friction
   Required: mass (kg), velocity (m/s), friction (coefficient 0-1)

4. "inclined_plane" - Block sliding down a slope/ramp/incline
   Required: mass (kg), angle (degrees), friction (coefficient), planeLength (meters)

5. "river_crossing" - Boat crossing river with current, or airplane with wind
   Required: boatSpeed (m/s), riverSpeed (m/s), angle (degrees), riverWidth (meters)

6. "rolling_ball" - Ball/sphere rolling down a slope/ramp
   Required: mass (kg), angle (degrees), radius (meters), planeLength (meters)

7. "circular_motion" - Object moving in a circle
   Required: radius (meters), angularVelocity (rad/s), mass (kg)

KEYWORDS:
- "incline", "slope", "ramp", "sliding down" → inclined_plane
- "river", "boat", "current", "airplane", "wind" → river_crossing
- "rolling", "rolls down" → rolling_ball
- "circle", "circular", "revolves", "rotates around" → circular_motion
- "thrown at angle" → projectile_motion
- "dropped", "falls" → free_fall
- "slides", "friction" → friction

Return format:
{{
  "scenario": "scenario_name",
  "parameter1": value,
  "parameter2": value
}}

Only include parameters relevant to the scenario. Return ONLY the JSON, no explanation."""

        # Call Groq API using requests
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'llama-3.3-70b-versatile',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a physics problem parser. Return only valid JSON.'
                    },
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'temperature': 0.1,
                'max_tokens': 200
            }
        )
        
        if response.status_code != 200:
            return jsonify({"success": False, "error": f"API error: {response.text}"}), 500
        
        # Parse response
        response_data = response.json()
        response_text = response_data['choices'][0]['message']['content'].strip()
        
        # Extract JSON from response (in case there's extra text)
        if '```json' in response_text:
            response_text = response_text.split('```json')[1].split('```')[0].strip()
        elif '```' in response_text:
            response_text = response_text.split('```')[1].split('```')[0].strip()
        
        parsed_data = json.loads(response_text)
        
        return jsonify({"success": True, "data": parsed_data})
        
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")  # Debug log
        return jsonify({"success": False, "error": f"Invalid JSON from AI: {str(e)}"}), 500
    except Exception as e:
        print(f"Exception: {str(e)}")  # Debug log
        import traceback
        traceback.print_exc()  # Print full traceback
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
