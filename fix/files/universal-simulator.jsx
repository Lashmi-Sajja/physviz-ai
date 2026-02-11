// ==================== UNIVERSAL PHYSICS SIMULATION RENDERER ====================
// Takes parsed JSON and renders ANY physics scenario on canvas

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const UniversalPhysicsSimulator = ({ parsedScenario }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [simulationState, setSimulationState] = useState(null);

  // ==================== SCENARIO-SPECIFIC PHYSICS ENGINES ====================

  const projectileFromHeightEngine = (t, scenario) => {
    const ball = scenario.entities.find(e => e.type === 'ball');
    const g = scenario.environment.gravity;
    
    const x = ball.initial_position.x + ball.initial_velocity.x * t;
    const y = ball.initial_position.y + ball.initial_velocity.y * t - 0.5 * g * t * t;
    const vx = ball.initial_velocity.x;
    const vy = ball.initial_velocity.y - g * t;
    
    return {
      entities: {
        [ball.id]: {
          position: { x, y: Math.max(0, y) },
          velocity: { x: vx, y: vy },
          landed: y <= 0
        }
      }
    };
  };

  const pulleySystemEngine = (t, scenario, prevState) => {
    // Atwood machine / pulley system physics
    const blocks = scenario.entities.filter(e => e.type === 'block');
    const pulley = scenario.entities.find(e => e.type === 'pulley');
    const g = scenario.environment.gravity;
    
    if (blocks.length !== 2) return prevState;
    
    const m1 = blocks[0].mass;
    const m2 = blocks[1].mass;
    
    // Calculate acceleration: a = (m1 - m2)g / (m1 + m2)
    const a = ((m1 - m2) * g) / (m1 + m2);
    
    // If no previous state, initialize
    if (!prevState) {
      return {
        entities: {
          [blocks[0].id]: {
            position: { ...blocks[0].initial_position },
            velocity: { x: 0, y: 0 },
            acceleration: a
          },
          [blocks[1].id]: {
            position: { ...blocks[1].initial_position },
            velocity: { x: 0, y: 0 },
            acceleration: -a
          },
          [pulley.id]: {
            position: pulley.properties.position,
            tension: (2 * m1 * m2 * g) / (m1 + m2)
          }
        },
        acceleration: a
      };
    }
    
    const dt = 0.016; // 60 FPS
    
    // Update block 1 (heavier - goes down)
    const v1_new = prevState.entities[blocks[0].id].velocity.y + a * dt;
    const y1_new = prevState.entities[blocks[0].id].position.y + v1_new * dt;
    
    // Update block 2 (lighter - goes up)
    const v2_new = prevState.entities[blocks[1].id].velocity.y - a * dt;
    const y2_new = prevState.entities[blocks[1].id].position.y + v2_new * dt;
    
    // Check constraints (rope length, ground)
    const ropeConstraint = scenario.constraints.find(c => c.type === 'rope');
    const totalRopeLength = ropeConstraint?.properties.length || 6;
    const pulleyY = pulley.properties.position.y;
    
    return {
      entities: {
        [blocks[0].id]: {
          position: { 
            x: blocks[0].initial_position.x, 
            y: Math.max(0.15, y1_new) // Don't go through ground
          },
          velocity: { x: 0, y: v1_new },
          acceleration: a
        },
        [blocks[1].id]: {
          position: { 
            x: blocks[1].initial_position.x, 
            y: Math.max(0.15, Math.min(pulleyY - 0.2, y2_new)) // Constrained by rope
          },
          velocity: { x: 0, y: v2_new },
          acceleration: -a
        },
        [pulley.id]: {
          position: pulley.properties.position,
          tension: (2 * m1 * m2 * g) / (m1 + m2)
        }
      },
      acceleration: a,
      tension: (2 * m1 * m2 * g) / (m1 + m2)
    };
  };

  const inclinedPlaneEngine = (t, scenario, prevState) => {
    const block = scenario.entities.find(e => e.type === 'block');
    const incline = scenario.entities.find(e => e.type === 'plane');
    const g = scenario.environment.gravity;
    const mu = scenario.environment.friction_coefficient || 0;
    const angle = incline.properties.angle * Math.PI / 180; // Convert to radians
    
    // Forces on incline
    const m = block.mass;
    const normalForce = m * g * Math.cos(angle);
    const frictionForce = mu * normalForce;
    const gravityComponent = m * g * Math.sin(angle);
    
    // Net force down the incline
    const netForce = gravityComponent - frictionForce;
    const acceleration = netForce / m;
    
    if (!prevState) {
      return {
        entities: {
          [block.id]: {
            position: { ...block.initial_position },
            velocity: { x: 0, y: 0 },
            acceleration: acceleration,
            distanceAlongIncline: 0
          },
          [incline.id]: {
            angle: incline.properties.angle,
            length: incline.properties.length
          }
        },
        forces: {
          normal: normalForce,
          friction: frictionForce,
          gravity: gravityComponent
        }
      };
    }
    
    const dt = 0.016;
    const prevDist = prevState.entities[block.id].distanceAlongIncline;
    const prevVel = prevState.entities[block.id].velocity.x;
    
    // Update velocity and distance along incline
    const newVel = prevVel + acceleration * dt;
    const newDist = prevDist + newVel * dt;
    
    // Convert distance along incline to x,y coordinates
    const newX = block.initial_position.x + newDist * Math.cos(angle);
    const newY = block.initial_position.y - newDist * Math.sin(angle);
    
    // Stop at bottom
    const maxDist = incline.properties.length;
    const stopped = newDist >= maxDist || newY <= 0.15;
    
    return {
      entities: {
        [block.id]: {
          position: { 
            x: stopped ? block.initial_position.x + maxDist * Math.cos(angle) : newX,
            y: stopped ? 0.15 : Math.max(0.15, newY)
          },
          velocity: { x: stopped ? 0 : newVel, y: 0 },
          acceleration: stopped ? 0 : acceleration,
          distanceAlongIncline: stopped ? maxDist : newDist,
          angle: angle
        },
        [incline.id]: {
          angle: incline.properties.angle,
          length: incline.properties.length
        }
      },
      forces: {
        normal: normalForce,
        friction: frictionForce,
        gravity: gravityComponent
      },
      stopped
    };
  };

  const blockOnPlankEngine = (t, scenario, prevState) => {
    // Block sliding on a horizontal plank with friction
    const block = scenario.entities.find(e => e.type === 'block' && e.label.includes('Block'));
    const plank = scenario.entities.find(e => e.type === 'block' && e.label.includes('Plank'));
    const g = scenario.environment.gravity;
    const mu = scenario.environment.friction_coefficient || 0.3;
    
    const m = block.mass;
    const initialVelocity = Math.sqrt(block.initial_velocity.x ** 2 + block.initial_velocity.y ** 2);
    
    // Friction deceleration
    const frictionForce = mu * m * g;
    const deceleration = frictionForce / m;
    
    if (!prevState) {
      return {
        entities: {
          [block.id]: {
            position: { ...block.initial_position },
            velocity: { x: block.initial_velocity.x, y: 0 },
            stopped: false
          },
          [plank.id]: {
            position: plank.initial_position,
            length: plank.properties?.length || 5
          }
        }
      };
    }
    
    const dt = 0.016;
    const prevVel = prevState.entities[block.id].velocity.x;
    
    // Decelerate due to friction
    const newVel = Math.max(0, prevVel - deceleration * dt);
    const newX = prevState.entities[block.id].position.x + newVel * dt;
    
    const stopped = newVel === 0;
    
    return {
      entities: {
        [block.id]: {
          position: { x: newX, y: block.initial_position.y },
          velocity: { x: newVel, y: 0 },
          stopped
        },
        [plank.id]: {
          position: plank.initial_position,
          length: plank.properties?.length || 5
        }
      }
    };
  };

  // ==================== UNIVERSAL STATE CALCULATOR ====================
  
  const calculateState = (t, scenario, prevState) => {
    if (!scenario) return null;
    
    switch (scenario.scenario_type) {
      case 'projectile':
        return projectileFromHeightEngine(t, scenario);
      
      case 'pulley':
        return pulleySystemEngine(t, scenario, prevState);
      
      case 'incline':
        return inclinedPlaneEngine(t, scenario, prevState);
      
      case 'friction':
        return blockOnPlankEngine(t, scenario, prevState);
      
      default:
        return null;
    }
  };

  // ==================== UNIVERSAL RENDERER ====================
  
  const renderScene = (ctx, width, height, scenario, state) => {
    if (!state || !scenario) return;
    
    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    const scale = 40; // pixels per meter
    const groundY = height - 60;
    
    // Draw ground
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, groundY, width, height - groundY);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText('Ground (y=0)', 10, groundY - 5);
    
    // Render based on scenario type
    switch (scenario.scenario_type) {
      case 'projectile':
        renderProjectile(ctx, width, height, groundY, scale, scenario, state);
        break;
      
      case 'pulley':
        renderPulley(ctx, width, height, groundY, scale, scenario, state);
        break;
      
      case 'incline':
        renderIncline(ctx, width, height, groundY, scale, scenario, state);
        break;
      
      case 'friction':
        renderFriction(ctx, width, height, groundY, scale, scenario, state);
        break;
    }
  };

  // ==================== SCENARIO-SPECIFIC RENDERERS ====================
  
  const renderProjectile = (ctx, width, height, groundY, scale, scenario, state) => {
    const ball = scenario.entities.find(e => e.type === 'ball');
    const building = scenario.entities.find(e => e.type === 'structure');
    const ballState = state.entities[ball.id];
    
    // Draw building if exists
    if (building && building.properties.height > 0) {
      const buildingHeight = building.properties.height * scale;
      const buildingWidth = 80;
      const buildingX = width / 2 - 100;
      
      ctx.fillStyle = '#64748b';
      ctx.fillRect(buildingX, groundY - buildingHeight, buildingWidth, buildingHeight);
      
      // Building windows
      ctx.fillStyle = '#fbbf24';
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < Math.floor(buildingHeight / 40); j++) {
          ctx.fillRect(buildingX + 15 + i * 15, groundY - buildingHeight + 10 + j * 40, 10, 15);
        }
      }
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px monospace';
      ctx.fillText(`Building: ${building.properties.height}m`, buildingX, groundY - buildingHeight - 10);
    }
    
    // Draw ball
    const ballX = width / 2 + ballState.position.x * scale;
    const ballY = groundY - ballState.position.y * scale;
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(ballX, groundY - 5, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball
    const gradient = ctx.createRadialGradient(ballX - 5, ballY - 5, 5, ballX, ballY, 15);
    gradient.addColorStop(0, '#60a5fa');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Velocity vector
    if (Math.abs(ballState.velocity.x) > 0.1 || Math.abs(ballState.velocity.y) > 0.1) {
      const vScale = 5;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballX + ballState.velocity.x * vScale, ballY - ballState.velocity.y * vScale);
      ctx.stroke();
      
      // Arrow
      const angle = Math.atan2(-ballState.velocity.y, ballState.velocity.x);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(
        ballX + ballState.velocity.x * vScale,
        ballY - ballState.velocity.y * vScale
      );
      ctx.lineTo(
        ballX + ballState.velocity.x * vScale - 10 * Math.cos(angle - Math.PI/6),
        ballY - ballState.velocity.y * vScale + 10 * Math.sin(angle - Math.PI/6)
      );
      ctx.lineTo(
        ballX + ballState.velocity.x * vScale - 10 * Math.cos(angle + Math.PI/6),
        ballY - ballState.velocity.y * vScale + 10 * Math.sin(angle + Math.PI/6)
      );
      ctx.fill();
      
      ctx.fillStyle = '#ef4444';
      ctx.font = '11px monospace';
      ctx.fillText(
        `v=(${ballState.velocity.x.toFixed(1)}, ${ballState.velocity.y.toFixed(1)}) m/s`,
        ballX + 25,
        ballY - 20
      );
    }
    
    // Info
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`Position: (${ballState.position.x.toFixed(2)}, ${ballState.position.y.toFixed(2)}) m`, 10, 20);
    ctx.fillText(`Velocity: (${ballState.velocity.x.toFixed(2)}, ${ballState.velocity.y.toFixed(2)}) m/s`, 10, 35);
    if (ballState.landed) {
      ctx.fillStyle = '#22c55e';
      ctx.fillText('LANDED', 10, 50);
    }
  };

  const renderPulley = (ctx, width, height, groundY, scale, scenario, state) => {
    const blocks = scenario.entities.filter(e => e.type === 'block');
    const pulley = scenario.entities.find(e => e.type === 'pulley');
    
    // Draw pulley
    const pulleyPos = state.entities[pulley.id].position;
    const pulleyX = width / 2 + pulleyPos.x * scale;
    const pulleyY = groundY - pulleyPos.y * scale;
    const pulleyRadius = pulley.properties.radius * scale;
    
    // Pulley circle
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(pulleyX, pulleyY, pulleyRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(pulleyX, pulleyY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw blocks
    blocks.forEach((block, idx) => {
      const blockState = state.entities[block.id];
      const blockX = width / 2 + blockState.position.x * scale;
      const blockY = groundY - blockState.position.y * scale;
      const blockWidth = block.dimensions.width * scale;
      const blockHeight = block.dimensions.height * scale;
      
      // Block shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(blockX - blockWidth/2 + 3, groundY - 8, blockWidth, 8);
      
      // Block
      const gradient = ctx.createLinearGradient(
        blockX - blockWidth/2, blockY - blockHeight/2,
        blockX + blockWidth/2, blockY + blockHeight/2
      );
      gradient.addColorStop(0, idx === 0 ? '#ef4444' : '#3b82f6');
      gradient.addColorStop(1, idx === 0 ? '#dc2626' : '#2563eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(blockX - blockWidth/2, blockY - blockHeight/2, blockWidth, blockHeight);
      
      // Block border
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX - blockWidth/2, blockY - blockHeight/2, blockWidth, blockHeight);
      
      // Mass label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${block.mass}kg`, blockX, blockY + 5);
      
      // Rope from block to pulley
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(blockX, blockY - blockHeight/2);
      if (idx === 0) {
        ctx.lineTo(pulleyX - pulleyRadius, pulleyY);
      } else {
        ctx.lineTo(pulleyX + pulleyRadius, pulleyY);
      }
      ctx.stroke();
    });
    
    // Info panel
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Acceleration: ${state.acceleration.toFixed(2)} m/s²`, 10, 20);
    ctx.fillText(`Tension: ${state.tension.toFixed(2)} N`, 10, 35);
    ctx.fillText(`Block 1 (${blocks[0].mass}kg): y=${state.entities[blocks[0].id].position.y.toFixed(2)}m`, 10, 50);
    ctx.fillText(`Block 2 (${blocks[1].mass}kg): y=${state.entities[blocks[1].id].position.y.toFixed(2)}m`, 10, 65);
  };

  const renderIncline = (ctx, width, height, groundY, scale, scenario, state) => {
    const block = scenario.entities.find(e => e.type === 'block');
    const incline = scenario.entities.find(e => e.type === 'plane');
    const blockState = state.entities[block.id];
    const inclineState = state.entities[incline.id];
    
    const angle = inclineState.angle * Math.PI / 180;
    const inclineLength = inclineState.length * scale;
    
    // Draw incline
    const inclineStartX = width / 2 - 150;
    const inclineStartY = groundY;
    const inclineEndX = inclineStartX + inclineLength * Math.cos(angle);
    const inclineEndY = groundY - inclineLength * Math.sin(angle);
    
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(inclineStartX, groundY);
    ctx.lineTo(inclineEndX, inclineEndY);
    ctx.lineTo(inclineEndX, groundY);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Angle arc
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(inclineStartX, groundY, 40, -angle, 0);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = '12px monospace';
    ctx.fillText(`${inclineState.angle}°`, inclineStartX + 50, groundY - 10);
    
    // Draw block
    const blockX = width / 2 + blockState.position.x * scale;
    const blockY = groundY - blockState.position.y * scale;
    const blockWidth = block.dimensions.width * scale;
    const blockHeight = block.dimensions.height * scale;
    
    ctx.save();
    ctx.translate(blockX, blockY);
    ctx.rotate(-blockState.angle);
    
    // Block
    const gradient = ctx.createLinearGradient(-blockWidth/2, -blockHeight/2, blockWidth/2, blockHeight/2);
    gradient.addColorStop(0, '#ef4444');
    gradient.addColorStop(1, '#dc2626');
    ctx.fillStyle = gradient;
    ctx.fillRect(-blockWidth/2, -blockHeight/2, blockWidth, blockHeight);
    
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(-blockWidth/2, -blockHeight/2, blockWidth, blockHeight);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${block.mass}kg`, 0, 4);
    
    ctx.restore();
    
    // Info
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText(`Velocity: ${blockState.velocity.x.toFixed(2)} m/s`, 10, 20);
    ctx.fillText(`Acceleration: ${blockState.acceleration.toFixed(2)} m/s²`, 10, 35);
    ctx.fillText(`Distance: ${blockState.distanceAlongIncline.toFixed(2)} m`, 10, 50);
    ctx.fillText(`Normal Force: ${state.forces.normal.toFixed(2)} N`, 10, 65);
    ctx.fillText(`Friction: ${state.forces.friction.toFixed(2)} N`, 10, 80);
    if (state.stopped) {
      ctx.fillStyle = '#22c55e';
      ctx.fillText('STOPPED', 10, 95);
    }
  };

  const renderFriction = (ctx, width, height, groundY, scale, scenario, state) => {
    const block = scenario.entities.find(e => e.label.includes('Block'));
    const plank = scenario.entities.find(e => e.label.includes('Plank'));
    const blockState = state.entities[block.id];
    const plankState = state.entities[plank.id];
    
    // Draw plank
    const plankLength = plankState.length * scale;
    const plankX = width / 2 - plankLength / 2;
    const plankY = groundY - 40;
    
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(plankX, plankY, plankLength, 20);
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(plankX, plankY, plankLength, 20);
    
    // Draw block
    const blockX = width / 2 + blockState.position.x * scale;
    const blockY = plankY - 30;
    const blockWidth = 40;
    const blockHeight = 40;
    
    // Block shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(blockX - blockWidth/2 + 3, plankY - 3, blockWidth, 8);
    
    // Block
    const gradient = ctx.createLinearGradient(
      blockX - blockWidth/2, blockY - blockHeight/2,
      blockX + blockWidth/2, blockY + blockHeight/2
    );
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#2563eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(blockX - blockWidth/2, blockY - blockHeight/2, blockWidth, blockHeight);
    
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(blockX - blockWidth/2, blockY - blockHeight/2, blockWidth, blockHeight);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${block.mass}kg`, blockX, blockY + 4);
    
    // Friction arrows
    if (!blockState.stopped && blockState.velocity.x > 0.1) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(blockX - blockWidth/2, blockY);
      ctx.lineTo(blockX - blockWidth/2 - 30, blockY);
      ctx.stroke();
      
      // Arrow head
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(blockX - blockWidth/2 - 30, blockY);
      ctx.lineTo(blockX - blockWidth/2 - 20, blockY - 5);
      ctx.lineTo(blockX - blockWidth/2 - 20, blockY + 5);
      ctx.fill();
      
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px monospace';
      ctx.fillText('Friction', blockX - blockWidth/2 - 30, blockY - 10);
    }
    
    // Info
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Velocity: ${blockState.velocity.x.toFixed(2)} m/s`, 10, 20);
    ctx.fillText(`Position: ${blockState.position.x.toFixed(2)} m`, 10, 35);
    ctx.fillText(`Friction coeff: ${scenario.environment.friction_coefficient}`, 10, 50);
    if (blockState.stopped) {
      ctx.fillStyle = '#22c55e';
      ctx.fillText('STOPPED', 10, 65);
    }
  };

  // ==================== ANIMATION LOOP ====================
  
  useEffect(() => {
    if (!parsedScenario) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let currentState = null;
    let currentTime = 0;
    
    const animate = () => {
      if (!isPlaying) {
        renderScene(ctx, canvas.width, canvas.height, parsedScenario, currentState || calculateState(0, parsedScenario, null));
        return;
      }
      
      currentTime += 0.016; // 60 FPS
      currentState = calculateState(currentTime, parsedScenario, currentState);
      
      if (currentState) {
        setSimulationState(currentState);
        setTime(currentTime);
        renderScene(ctx, canvas.width, canvas.height, parsedScenario, currentState);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, parsedScenario]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setSimulationState(null);
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6">
      <canvas
        ref={canvasRef}
        width={900}
        height={600}
        className="w-full bg-slate-950 rounded-xl border-2 border-blue-500/30"
      />
      
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-semibold transition"
        >
          <RotateCcw size={20} />
          Reset
        </button>
        
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="text-gray-400">Time: {time.toFixed(2)}s</span>
          <span className="text-gray-400">Scenario: {parsedScenario?.scenario_type}</span>
        </div>
      </div>
    </div>
  );
};

export default UniversalPhysicsSimulator;
