# Physics Modules Specification

This document lists the physics modules that are currently implemented in the PhysViz AI prototype.

## Module Organization

### 1. KINEMATICS (Motion)

#### 1.1 Vertical Projectile
**Status:** ✅ Implemented

**Problem Examples:**
- "A ball is thrown straight up with speed 10 m/s"
- "A stone is thrown vertically upward with initial velocity 15 m/s"

**Parameters:**
- initial_velocity (m/s)
- initial_height (m)
- gravity (9.8 m/s²)

---

#### 1.2 Projectile Motion (Angle)
**Status:** ✅ Implemented

**Problem Examples:**
- "A ball is thrown at 45° with speed 20 m/s"
- "A projectile is launched at 30 degrees with velocity 25 m/s"

**Parameters:**
- initial_velocity (m/s)
- angle (degrees)
- initial_height (m)
- gravity (9.8 m/s²)

---

#### 1.3 Free Fall
**Status:** ✅ Implemented

**Problem Examples:**
- "A ball is dropped from 50 meters"
- "An object falls from rest at height 100m"

**Parameters:**
- initial_height (m)
- gravity (9.8 m/s²)
- initial_velocity = 0

---

#### 1.4 Relative Velocity
**Status:** ✅ Implemented

**Problem Examples:**
- "A boat crosses a river with a current."
- "An airplane flies in windy conditions."

**Parameters:**
- object_speed (m/s)
- object_angle (degrees)
- medium_speed (m/s)
- medium_angle (degrees)

---

### 2. FORCES & DYNAMICS

#### 2.1 Friction
**Status:** ✅ Implemented

**Problem Examples:**
- "A 10kg block slides on surface with friction coefficient 0.3"
- "A box is pushed with 50N on rough surface (μ=0.2)"

**Parameters:**
- mass (kg)
- velocity (m/s)
- friction (coefficient)
- gravity (9.8 m/s²)

---
