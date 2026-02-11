# Physics Modules Specification

## Module Organization

### 1. KINEMATICS (Motion)

#### 1.1 Vertical Projectile
**Status:** ✅ Implemented in prototype

**Problem Examples:**
- "A ball is thrown straight up with speed 10 m/s"
- "A stone is thrown vertically upward with initial velocity 15 m/s"

**Parameters:**
- initial_velocity (m/s)
- initial_height (m)
- gravity (9.8 m/s²)

**Visualization:**
- Ball moving up/down
- Height vs time graph
- Velocity vector
- Energy bars (KE, PE)

**Key Insights:**
- Velocity = 0 at peak
- Symmetric motion
- Energy conservation

---

#### 1.2 Projectile Motion (Angle)
**Status:** ⚠️ Needs implementation

**Problem Examples:**
- "A ball is thrown at 45° with speed 20 m/s"
- "A projectile is launched at 30 degrees with velocity 25 m/s"
- "A cannon fires at 60° angle with initial speed 50 m/s"

**Parameters:**
- initial_velocity (m/s)
- angle (degrees)
- initial_height (m)
- gravity (9.8 m/s²)

**Visualization:**
- Parabolic trajectory path
- Velocity components (vx, vy)
- Range marker
- Max height indicator
- Time of flight

**Key Insights:**
- 45° gives maximum range
- Horizontal velocity constant
- Vertical motion independent
- Symmetric trajectory

**Equations:**
```
vx = v0 * cos(θ)
vy = v0 * sin(θ) - g*t
x = vx * t
y = vy * t - 0.5*g*t²
Range = v0² * sin(2θ) / g
Max Height = v0² * sin²(θ) / (2g)
```

---

#### 1.3 Free Fall
**Status:** ❌ Not implemented

**Problem Examples:**
- "A ball is dropped from 50 meters"
- "An object falls from rest at height 100m"
- "A stone is released from a tower 80m high"

**Parameters:**
- initial_height (m)
- gravity (9.8 m/s²)
- initial_velocity = 0

**Visualization:**
- Object falling straight down
- Speed increasing
- Distance markers
- Velocity meter
- Time elapsed

**Key Insights:**
- Acceleration constant (g)
- Velocity increases linearly
- Distance increases quadratically
- v² = 2gh

**Equations:**
```
v = g*t
h = 0.5*g*t²
v² = 2*g*h
```

---

#### 1.4 Horizontal Motion
**Status:** ❌ Not implemented

**Problem Examples:**
- "A car moves at constant speed 20 m/s"
- "A block slides horizontally at 5 m/s"

**Parameters:**
- velocity (m/s)
- distance (m)

**Visualization:**
- Object moving horizontally
- Distance markers
- Speed indicator
- Time elapsed

**Key Insights:**
- Constant velocity
- No acceleration
- Distance = velocity × time

---

### 2. FORCES & DYNAMICS

#### 2.1 Newton's Second Law (F=ma)
**Status:** ❌ Not implemented

**Problem Examples:**
- "A 5kg block is pushed with force 20N"
- "A 10kg object experiences 50N force"

**Parameters:**
- mass (kg)
- force (N)
- friction (optional)

**Visualization:**
- Block with force arrow
- Acceleration vector
- Velocity increasing
- Distance traveled

**Key Insights:**
- F = ma
- Larger force → larger acceleration
- Larger mass → smaller acceleration

**Equations:**
```
a = F/m
v = a*t
x = 0.5*a*t²
```

---

#### 2.2 Friction
**Status:** ❌ Not implemented

**Problem Examples:**
- "A 10kg block slides on surface with friction coefficient 0.3"
- "A box is pushed with 50N on rough surface (μ=0.2)"

**Parameters:**
- mass (kg)
- applied_force (N)
- friction_coefficient (μ)
- gravity (9.8 m/s²)

**Visualization:**
- Block sliding
- Force arrows (applied, friction, normal)
- Velocity changing
- Eventually stops

**Key Insights:**
- Friction opposes motion
- f = μ * N
- Net force = Applied - Friction
- Deceleration when friction > applied force

**Equations:**
```
N = m*g
f_friction = μ * N
F_net = F_applied - f_friction
a = F_net / m
```

---

#### 2.3 Inclined Plane
**Status:** ❌ Not implemented

**Problem Examples:**
- "A 5kg block slides down a 30° incline"
- "An object on a ramp at 45° with friction 0.2"

**Parameters:**
- mass (kg)
- angle (degrees)
- friction_coefficient (μ)
- gravity (9.8 m/s²)

**Visualization:**
- Inclined plane
- Block sliding down
- Force components (parallel, perpendicular)
- Acceleration vector

**Key Insights:**
- Component of gravity causes motion
- Steeper angle → faster acceleration
- Friction reduces acceleration

**Equations:**
```
F_parallel = m*g*sin(θ)
F_perpendicular = m*g*cos(θ)
N = F_perpendicular
f = μ*N
a = g*(sin(θ) - μ*cos(θ))
```

---

#### 2.4 Pulley System (Atwood Machine)
**Status:** ❌ Not implemented

**Problem Examples:**
- "Two masses 5kg and 3kg connected by pulley"
- "Atwood machine with masses 10kg and 8kg"

**Parameters:**
- mass1 (kg)
- mass2 (kg)
- gravity (9.8 m/s²)

**Visualization:**
- Pulley with two masses
- Masses moving (one up, one down)
- Tension force shown
- Acceleration indicator

**Key Insights:**
- Heavier mass accelerates down
- Both masses have same acceleration
- Tension same throughout rope

**Equations:**
```
a = (m1 - m2)*g / (m1 + m2)
T = 2*m1*m2*g / (m1 + m2)
```

---

### 3. ENERGY

#### 3.1 Energy Conservation
**Status:** ⚠️ Partially in prototype

**Problem Examples:**
- "A 2kg ball falls from 10m height"
- "A pendulum swings from 30° angle"

**Parameters:**
- mass (kg)
- initial_height (m)
- gravity (9.8 m/s²)

**Visualization:**
- Object in motion
- Energy bars (KE, PE, Total)
- Energy transformation animation
- Numerical values

**Key Insights:**
- Total energy constant
- PE converts to KE
- KE = 0.5*m*v²
- PE = m*g*h

---

#### 3.2 Spring (Hooke's Law)
**Status:** ❌ Not implemented

**Problem Examples:**
- "A spring with k=100 N/m is compressed 0.5m"
- "A 2kg mass attached to spring (k=50 N/m)"

**Parameters:**
- spring_constant (k)
- compression/extension (x)
- mass (kg)

**Visualization:**
- Spring oscillating
- Mass bouncing
- Energy bars (KE, PE_spring)
- Position vs time graph

**Key Insights:**
- F = -kx
- PE_spring = 0.5*k*x²
- Simple harmonic motion

**Equations:**
```
F = -k*x
PE = 0.5*k*x²
ω = sqrt(k/m)
T = 2π*sqrt(m/k)
```

---

### 4. COLLISIONS

#### 4.1 Elastic Collision
**Status:** ❌ Not implemented

**Problem Examples:**
- "Two balls (3kg at 5m/s, 2kg at rest) collide elastically"
- "Elastic collision between 5kg and 4kg objects"

**Parameters:**
- mass1, mass2 (kg)
- velocity1, velocity2 (m/s)

**Visualization:**
- Two objects approaching
- Collision moment
- Objects bouncing apart
- Velocity vectors before/after
- Momentum/energy conservation display

**Key Insights:**
- Momentum conserved
- Kinetic energy conserved
- Velocities exchange (equal mass)

**Equations:**
```
v1_final = ((m1-m2)*v1 + 2*m2*v2) / (m1+m2)
v2_final = ((m2-m1)*v2 + 2*m1*v1) / (m1+m2)
```

---

#### 4.2 Inelastic Collision
**Status:** ❌ Not implemented

**Problem Examples:**
- "Two objects stick together after collision"
- "Perfectly inelastic collision: 5kg at 10m/s hits 3kg at rest"

**Parameters:**
- mass1, mass2 (kg)
- velocity1, velocity2 (m/s)

**Visualization:**
- Two objects approaching
- Collision and stick together
- Combined object moving
- Energy loss shown

**Key Insights:**
- Momentum conserved
- Kinetic energy NOT conserved
- Energy lost as heat/deformation

**Equations:**
```
v_final = (m1*v1 + m2*v2) / (m1 + m2)
KE_lost = KE_initial - KE_final
```

---

### 5. CIRCULAR MOTION

#### 5.1 Uniform Circular Motion
**Status:** ❌ Not implemented

**Problem Examples:**
- "A 2kg object moves in circle radius 5m at 10 m/s"
- "Circular motion with period 4 seconds"

**Parameters:**
- mass (kg)
- radius (m)
- velocity or period (m/s or s)

**Visualization:**
- Object moving in circle
- Velocity vector (tangent)
- Centripetal force arrow (toward center)
- Angular velocity indicator

**Key Insights:**
- Velocity direction constantly changes
- Centripetal acceleration toward center
- F_c = m*v²/r

**Equations:**
```
a_c = v²/r
F_c = m*v²/r
ω = v/r
T = 2πr/v
```

---

#### 5.2 Simple Pendulum
**Status:** ❌ Not implemented

**Problem Examples:**
- "A pendulum of length 2m swings from 30° angle"
- "Simple pendulum with 1m string and 0.5kg mass"

**Parameters:**
- length (m)
- initial_angle (degrees)
- mass (kg)
- gravity (9.8 m/s²)

**Visualization:**
- Pendulum swinging
- Angle indicator
- Velocity at bottom
- Energy transformation
- Period measurement

**Key Insights:**
- Period independent of mass
- Period depends on length
- Energy conservation
- Simple harmonic motion (small angles)

**Equations:**
```
T = 2π*sqrt(L/g)
v_max = sqrt(2*g*L*(1-cos(θ)))
```

---

## Implementation Priority

### Phase 1 (MVP - Hackathon)
1. ✅ Vertical Projectile (done)
2. 🔥 Projectile Motion (angle)
3. 🔥 Free Fall
4. 🔥 Friction

### Phase 2 (Post-Hackathon)
5. Inclined Plane
6. Elastic Collision
7. Spring/SHM
8. Pendulum

### Phase 3 (Advanced)
9. Pulley System
10. Circular Motion
11. Inelastic Collision
12. Complex scenarios

---

## Module Template Structure

Each module should have:

```javascript
{
  id: "module_name",
  category: "kinematics|forces|energy|collisions|circular",
  name: "Display Name",
  description: "Brief description",
  
  // AI parsing
  keywords: ["word1", "word2"],
  
  // Parameters
  parameters: {
    param1: { type: "number", unit: "m/s", default: 10, min: 0, max: 100 },
    param2: { type: "number", unit: "degrees", default: 45, min: 0, max: 90 }
  },
  
  // Physics engine
  equations: {
    position: (t, params) => { /* calculation */ },
    velocity: (t, params) => { /* calculation */ },
    // ...
  },
  
  // Visualization
  render: (canvas, state) => { /* drawing code */ },
  
  // Insights
  insights: [
    { trigger: "condition", message: "insight text" }
  ],
  
  // What-if scenarios
  whatIf: [
    { question: "What if...", prediction: "..." }
  ]
}
```

---

## Next Steps

1. Create modular architecture for physics scenarios
2. Implement each module independently
3. Build scenario selector UI
4. Integrate with LLM for auto-detection
5. Test each module thoroughly
