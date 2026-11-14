import React, { useRef, useEffect } from 'react';
import { Droplet, Sun, CloudRain, HeartPulse } from 'lucide-react';

export default function PlantVisualizerCanvas({ plant, moisture, light, rainDetected, isPumpActive }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let tick = 0;

    // Particles for rain and pump water
    const rainDrops = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 4 + Math.random() * 6,
      length: 10 + Math.random() * 10
    }));

    const pumpDrops = Array.from({ length: 25 }, () => ({
      x: 100 + Math.random() * 40,
      y: 200,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      alpha: 1
    }));

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Environment Background (Sun light aura / sky mood)
      const lightFactor = Math.min(1, light / 1000);
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.7);
      skyGrad.addColorStop(0, `rgba(15, 23, 42, ${1 - lightFactor * 0.4})`);
      skyGrad.addColorStop(1, `rgba(16, 185, 129, ${0.05 + lightFactor * 0.1})`);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.7);

      // Sun beams if light is high
      if (light > 500) {
        ctx.save();
        ctx.globalAlpha = (light - 500) / 1000 * 0.3;
        const sunGrad = ctx.createRadialGradient(width * 0.8, 50, 10, width * 0.8, 50, 200);
        sunGrad.addColorStop(0, '#fef08a');
        sunGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(width * 0.8, 50, 200, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Draw Soil & Pot Container
      const potTop = height * 0.7;
      const potHeight = height * 0.3;
      const soilWetness = moisture / 100;

      // Soil Color: dry brown to dark rich wet soil
      const r = Math.round(120 - soilWetness * 60);
      const g = Math.round(80 - soilWetness * 40);
      const b = Math.round(50 - soilWetness * 30);
      
      // Pot Shape
      ctx.beginPath();
      ctx.moveTo(width * 0.25, potTop);
      ctx.lineTo(width * 0.75, potTop);
      ctx.lineTo(width * 0.68, height - 10);
      ctx.lineTo(width * 0.32, height - 10);
      ctx.closePath();

      const soilGrad = ctx.createLinearGradient(0, potTop, 0, height);
      soilGrad.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
      soilGrad.addColorStop(1, `rgb(${Math.max(10, r - 30)}, ${Math.max(10, g - 20)}, ${Math.max(5, b - 15)})`);
      ctx.fillStyle = soilGrad;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#2e7559';
      ctx.stroke();

      // Soil moisture shimmer dots
      if (moisture > 40) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        for (let i = 0; i < 15; i++) {
          const sx = width * 0.3 + (i * 27 % (width * 0.4));
          const sy = potTop + 15 + ((i * 19) % (potHeight - 30));
          ctx.beginPath();
          ctx.arc(sx, sy, 2 + Math.sin(tick * 0.05 + i) * 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Draw Plant Roots
      ctx.strokeStyle = 'rgba(254, 243, 199, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, potTop);
      ctx.quadraticCurveTo(width * 0.45, potTop + 40, width * 0.4, potTop + 70);
      ctx.moveTo(width * 0.5, potTop);
      ctx.quadraticCurveTo(width * 0.55, potTop + 45, width * 0.6, potTop + 65);
      ctx.moveTo(width * 0.5, potTop);
      ctx.lineTo(width * 0.5, potTop + 80);
      ctx.stroke();

      // 4. Draw Plant Stem & Leaves (Swaying with wind)
      const sway = Math.sin(tick * 0.03) * 6;
      const plantHealth = moisture < plant.minMoisture ? 'drooping' : moisture > plant.maxMoisture + 25 ? 'overwatered' : 'healthy';

      ctx.save();
      ctx.translate(width * 0.5, potTop);
      
      let stemCurveX = sway;
      if (plantHealth === 'drooping') stemCurveX *= 1.8;

      // Draw Main Central Stem
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(stemCurveX * 0.4, -90, stemCurveX, -190);
      ctx.lineWidth = 10;
      ctx.strokeStyle = plantHealth === 'drooping' ? '#65a30d' : '#15803d';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Compound Tomato Leaf Cluster Helper
      const drawTomatoLeafCluster = (lx, ly, angle, scale = 1, isDrooping = false) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(angle);

        const fillCol = isDrooping ? '#a3e635' : '#22c55e';
        const strokeCol = '#15803d';

        // Petiole / Sub-stem
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(40 * scale, 0);
        ctx.lineWidth = 3 * scale;
        ctx.strokeStyle = strokeCol;
        ctx.stroke();

        // Terminal Leaf
        ctx.beginPath();
        ctx.ellipse(45 * scale, 0, 18 * scale, 9 * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = fillCol;
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Side Leaflets
        [-0.4, 0.4].forEach(rot => {
          ctx.save();
          ctx.translate(22 * scale, 0);
          ctx.rotate(rot);
          ctx.beginPath();
          ctx.ellipse(14 * scale, 0, 14 * scale, 7 * scale, 0, 0, Math.PI * 2);
          ctx.fillStyle = fillCol;
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });

        ctx.restore();
      };

      // Helper to draw realistic Red Tomatoes
      const drawTomatoFruit = (tx, ty, radius = 12) => {
        ctx.save();
        ctx.translate(tx, ty);

        // Tomato Body
        const tomatoGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 2, 0, 0, radius);
        tomatoGrad.addColorStop(0, '#f87171');
        tomatoGrad.addColorStop(0.4, '#ef4444');
        tomatoGrad.addColorStop(1, '#b91c1c');

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = tomatoGrad;
        ctx.fill();
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Green Calyx / Stem Cap
        ctx.fillStyle = '#15803d';
        for (let i = 0; i < 5; i++) {
          const a = (i * Math.PI * 2) / 5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * (radius * 0.6), Math.sin(a) * (radius * 0.6));
          ctx.lineTo(Math.cos(a + 0.3) * (radius * 0.2), Math.sin(a + 0.3) * (radius * 0.2));
          ctx.fill();
        }

        ctx.restore();
      };

      const isDroop = plantHealth === 'drooping';
      
      // Branch 1 (Left Lower)
      drawTomatoLeafCluster(stemCurveX * 0.2, -45, -0.6 + (isDroop ? 0.4 : sway * 0.01), 1.1, isDroop);
      
      // Branch 2 (Right Lower)
      drawTomatoLeafCluster(stemCurveX * 0.4, -85, 0.6 + (isDroop ? 0.3 : sway * 0.01), 1.2, isDroop);

      // Branch 3 (Left Mid)
      drawTomatoLeafCluster(stemCurveX * 0.6, -125, -0.5 + (isDroop ? 0.5 : sway * 0.01), 1.0, isDroop);

      // Branch 4 (Right Upper)
      drawTomatoLeafCluster(stemCurveX * 0.8, -160, 0.5 + (isDroop ? 0.3 : sway * 0.01), 0.9, isDroop);

      // Top Cluster
      drawTomatoLeafCluster(stemCurveX, -188, -0.1 + sway * 0.01, 0.8, isDroop);

      // Always render Ripe Red Tomato Fruit Clusters
      drawTomatoFruit(stemCurveX * 0.35 + 18, -75, 14);
      drawTomatoFruit(stemCurveX * 0.35 + 32, -68, 11);
      drawTomatoFruit(stemCurveX * 0.65 - 20, -115, 13);
      drawTomatoFruit(stemCurveX * 0.85 + 15, -150, 10);

      ctx.restore();

      // 5. Draw Rain Effect if rainDetected is true
      if (rainDetected) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1.5;
        rainDrops.forEach(drop => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          ctx.stroke();

          drop.y += drop.speed;
          if (drop.y > height) {
            drop.y = -20;
            drop.x = Math.random() * width;
          }
        });
      }

      // 6. Draw Automated Water Pump Spray if Active
      if (isPumpActive) {
        ctx.fillStyle = '#38bdf8';
        pumpDrops.forEach(pd => {
          ctx.beginPath();
          ctx.arc(pd.x, pd.y, 3, 0, Math.PI * 2);
          ctx.fill();

          pd.x += pd.vx;
          pd.y += pd.vy;
          if (pd.y > potTop + 10) {
            pd.y = potTop - 40;
            pd.x = width * 0.3 + Math.random() * (width * 0.4);
          }
        });

        // Water pipe graphic
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(width * 0.2, potTop - 60, 40, 10);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [plant, moisture, light, rainDetected, isPumpActive]);

  const healthState = moisture < plant.minMoisture ? 'Underwatered (Dry Soil)' : moisture > plant.maxMoisture ? 'High Saturation' : 'Optimal Hydration';
  const healthColor = moisture < plant.minMoisture ? '#f59e0b' : moisture > plant.maxMoisture ? '#38bdf8' : '#34d399';

  return (
    <div className="glass-card visualizer-card">
      <div className="visualizer-header">
        <div>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeartPulse size={18} color={healthColor} /> Real-Time Plant Micro-Ecosystem
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Dynamic 2D canvas simulating transpiration, soil saturation & foliage bloom.
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '0.3rem 0.75rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          color: healthColor,
          fontWeight: 700,
          border: `1px solid ${healthColor}`
        }}>
          {healthState}
        </div>
      </div>

      <div className="visualizer-canvas-wrapper">
        <canvas ref={canvasRef} width={600} height={380} className="plant-canvas" />

        <div className="visualizer-overlay-stats">
          <div className="stat-chip">
            <Droplet size={14} color="#38bdf8" /> Soil Moisture: <span className="val">{moisture}%</span>
          </div>
          <div className="stat-chip">
            <Sun size={14} color="#fef08a" /> Sun Intensity: <span className="val">{light} Lux</span>
          </div>
          <div className="stat-chip">
            <CloudRain size={14} color={rainDetected ? '#38bdf8' : '#94a3b8'} /> Rain: <span className="val" style={{ color: rainDetected ? '#38bdf8' : '#94a3b8' }}>{rainDetected ? 'DETECTED' : 'Clear'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
