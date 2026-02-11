# Technical Architecture

## System Overview

PhysicsViz follows a client-server architecture with AI-powered natural language processing.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Text Input   │  │  Canvas      │  │  Controls    │      │
│  │   Box        │  │ (p5.js)      │  │  (Sliders)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP POST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Flask Backend                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Endpoint (/api/parse)               │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           LLM Integration (OpenAI/Gemini)            │   │
│  │  - Extract entities                                  │   │
│  │  - Identify parameters                               │   │
│  │  - Classify scenario type                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Physics Parameter Parser                │   │
│  │  - Validate extracted data                           │   │
│  │  - Set defaults                                      │   │
│  │  - Structure JSON response                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ JSON Response
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Frontend Visualization                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Physics Engine (JavaScript)             │   │
│  │  - Kinematic equations                               │   │
│  │  - Position/velocity calculations                    │   │
│  │  - Collision detection                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           p5.js Rendering Engine                     │   │
│  │  - Draw objects                                      │   │
│  │  - Animate motion                                    │   │
│  │  - Update display (60 FPS)                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer

#### User Interface (HTML/CSS)
- **Input Section**: Text area for problem statement
- **Visualization Canvas**: 800x600px canvas for animation
- **Control Panel**: Sliders and buttons for interaction

#### JavaScript Logic (script.js)
- **Event Handlers**: Capture user input and interactions
- **API Communication**: Fetch API calls to backend
- **State Management**: Track simulation state and parameters

#### p5.js Visualization
- **Setup**: Initialize canvas and variables
- **Draw Loop**: 60 FPS animation loop
- **Physics Calculations**: Real-time position updates
- **Rendering**: Draw objects, trajectories, labels

### 2. Backend Layer

#### Flask Application (app.py)
```python
Flask Server
├── Route: /
│   └── Serve index.html
├── Route: /api/parse
│   ├── Receive problem text
│   ├── Call LLM API
│   ├── Parse response
│   └── Return JSON
└── Route: /api/health
    └── Health check
```

#### LLM Integration
- **Provider**: OpenAI GPT-4 or Google Gemini
- **Prompt Engineering**: Structured prompts for parameter extraction
- **Response Parsing**: Convert LLM output to structured JSON

#### Physics Module (physics.py)
- **Scenario Classification**: Identify problem type
- **Parameter Validation**: Ensure valid physics values
- **Default Values**: Fill missing parameters

### 3. Data Flow

```
1. User enters problem text
   ↓
2. Frontend sends POST to /api/parse
   ↓
3. Backend receives request
   ↓
4. LLM processes text and extracts parameters
   ↓
5. Backend validates and structures data
   ↓
6. JSON response sent to frontend
   ↓
7. Frontend initializes physics simulation
   ↓
8. p5.js renders animation loop
   ↓
9. User adjusts parameters via sliders
   ↓
10. Simulation updates in real-time
```

## Technology Choices

### Why Flask?
- Lightweight and fast to set up
- Simple routing for REST API
- Easy integration with Python libraries
- Minimal boilerplate code

### Why p5.js?
- Simple canvas-based drawing
- Built-in animation loop
- Easy coordinate system
- No complex setup required

### Why LLM API?
- Handles natural language understanding
- Flexible parameter extraction
- No need to train custom models
- Quick integration

## Physics Implementation

### Kinematic Equations Used

**Position:**
```
x(t) = x₀ + v₀ₓ * t
y(t) = y₀ + v₀ᵧ * t - 0.5 * g * t²
```

**Velocity:**
```
vₓ(t) = v₀ₓ
vᵧ(t) = v₀ᵧ - g * t
```

**Component Breakdown:**
```
v₀ₓ = v₀ * cos(θ)
v₀ᵧ = v₀ * sin(θ)
```

### Collision Detection
```javascript
if (y <= ground_level && vy < 0) {
    // Ball hit ground
    y = ground_level;
    vy = 0;
}
```

## Performance Considerations

- **Frontend**: 60 FPS animation using requestAnimationFrame
- **Backend**: Async API calls to LLM
- **Caching**: Store common problem patterns (future enhancement)
- **Optimization**: Minimal DOM manipulation

## Security

- **Input Validation**: Sanitize user input
- **API Key Protection**: Environment variables
- **CORS**: Configured for local development
- **Rate Limiting**: Not implemented (hackathon scope)

## Scalability

Current architecture supports:
- Single user sessions
- Local deployment
- Synchronous processing

Future improvements:
- WebSocket for real-time collaboration
- Database for saving simulations
- Cloud deployment (AWS/GCP)
- Caching layer (Redis)
