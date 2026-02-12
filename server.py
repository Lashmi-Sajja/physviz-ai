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

First, here is an example of how to parse a problem:
Problem: "An airplane flies at 500 km/h North in a wind blowing 50 km/h East."
JSON:
{{
  "scenario": "relative_velocity",
  "object_speed": 500,
  "object_angle": 270,
  "medium_speed": 50,
  "medium_angle": 0
}}

Now, parse the following problem based on the rules provided.

Problem: {problem}

Identify the scenario type and extract relevant parameters:

SCENARIO RULES:
1. "projectile_motion" - Ball/object thrown at an angle (not straight up/down)
   Required: velocity, angle
   
2. "free_fall" - Ball/object dropped or falling straight down (no initial horizontal velocity)
   Required: height
   
3. "friction" - Block/object sliding on a surface with friction
   Required: mass, velocity, friction

4. "relative_velocity" - Boat in a river, airplane in wind, etc.
   - Extracts the speed and direction (angle) for both the object and the medium.
   - Angle conventions: 0 degrees is East (right), 90 is South (down), 180 is West (left), 270 is North (up).
   - If directions are ambiguous, assume the object is pointed East (angle: 0) and the medium is flowing South (angle: 90).
   - Required: object_speed, object_angle, medium_speed, medium_angle

IMPORTANT:
- If thrown "straight up" or "vertically" → use "projectile_motion" with angle=90
- If "dropped" or "falls" → use "free_fall"
- If "slides" or mentions friction → use "friction"
- If it mentions a boat in a river, or a plane in wind -> use "relative_velocity"
- If thrown at any angle → use "projectile_motion"

Return format:
{{
  "scenario": "projectile_motion" or "free_fall" or "friction" or "relative_velocity",
  "velocity": number (if applicable),
  "angle": number (if applicable, 0-90),
  "height": number (if applicable),
  "mass": number (if applicable),
  "friction": number (if applicable),
  "object_speed": number (if applicable),
  "object_angle": number (if applicable),
  "medium_speed": number (if applicable),
  "medium_angle": number (if applicable)
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
