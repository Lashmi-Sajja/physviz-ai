# PhysViz AI: AI-Powered Physics Problem Visualizer

**PhysViz AI** bridges the gap between abstract physics problems and conceptual understanding by transforming natural language word problems into interactive, real-time visual simulations.

## Key Features

-   **AI-Powered Problem Parsing:** Enter a custom physics problem and watch as our AI, powered by the Groq API (Llama 3), extracts the parameters and sets up the simulation.
-   **Interactive Visualizations:** A dynamic canvas renders the physics scenarios at 60 FPS, providing immediate visual feedback.
-   **Real-Time Parameter Control:** Adjust parameters like velocity, angle, and mass using sliders and see the effects on the simulation instantly.
-   **Structured Learning Modules:** Explore concepts through a curated set of modules and lessons.
-   **Live Physics Graphs:** See a real-time plot of Height vs. Time for the simulations.

### Implemented Physics Modules
-   ✅ **Projectile Motion** (at an angle)
-   ✅ **Vertical Projectile**
-   ✅ **Free Fall**
-   ✅ **Friction**
-   ✅ **Relative Velocity**

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   Python 3.8+
-   `pip` for package installation
-   A Groq API Key

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/physviz-ai.git
    cd physviz-ai
    ```

2.  **Set up the Python virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up your environment variables:**
    -   Create a file named `.env` in the root of the project.
    -   Add your Groq API key to it:
        ```
        GROQ_API_KEY="your-groq-api-key-here"
        ```

### Running the Prototype

1.  **Start the Flask server:**
    ```bash
    python server.py
    ```

2.  **Open your browser:**
    -   Navigate to `http://127.0.0.1:5000`

## How to Use

1.  **Start Learning:** From the home page, click "Start Learning".
2.  **Choose a Module:**
    -   Select a pre-defined module like "Kinematics" to see a list of concepts. Click on a concept to launch the simulator with a default lesson.
    -   Or, select "Custom Problem" to use the AI parser.
3.  **Interact with the Simulation:**
    -   If using a pre-defined module, use the sliders on the right to adjust the parameters.
    -   If using the custom input, type your problem, click "Parse with AI", and then "Run Simulation".
    -   Use the "Play/Pause" and "Reset" buttons to control the animation.

## Project Structure

```
physviz-ai/
├── src/
│   ├── core/
│   │   ├── P5PhysicsRenderer.js  # Core physics and rendering engine
│   │   └── GraphRenderer.js      # Real-time graph plotting
│   ├── kiro.html                 # Main application UI
│   ├── kiro-styles.css           # Application styling
│   └── kiro-app.js               # Main application logic and state
├── docs/                         # Project documentation
├── server.py                     # Flask backend server
├── requirements.txt              # Python dependencies
└── README.md
```

## Architecture

The application uses a client-server architecture.
-   The **Frontend** is a vanilla JavaScript single-page application that handles the UI, user interaction, and all physics rendering via the HTML5 Canvas (powered by p5.js).
-   The **Backend** is a lightweight Flask server that serves the frontend and acts as an intermediary to the **Groq API** for natural language processing. The core of the AI parsing is handled by carefully engineered prompts sent to the Llama 3 model.

For more details, see `docs/ARCHITECTURE.md`.

## Tech Stack

-   **Frontend:** Vanilla JS (ES6), p5.js, HTML5, CSS3
-   **Backend:** Flask (Python)
-   **AI:** Groq API (Llama 3)

## Roadmap

-   **Short Term:** Implement more physics modules from our list of 14, including Inclined Planes and Collisions. Enhance the graph to plot more variables (e.g., velocity, energy).
-   **Medium Term:** Introduce a "What-If" scenario feature where the AI predicts outcomes of parameter changes. Implement user accounts to save progress and custom problems.
-   **Long Term:** Explore 3D visualizations using WebGL/Three.js and expand the learning platform with quizzes and more detailed educational content.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
