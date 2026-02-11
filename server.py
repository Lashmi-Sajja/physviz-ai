from flask import Flask, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='src')
CORS(app)

@app.route('/')
def index():
    return send_from_directory('src', 'kiro.html')

@app.route('/simple')
def simple():
    return send_from_directory('src', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('src', path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
