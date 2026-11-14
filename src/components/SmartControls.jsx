import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Zap, ShieldCheck, RefreshCw, Clock, Droplets, AlertTriangle } from 'lucide-react';

export default function SmartControls({
  isAutoMode,
  setIsAutoMode,
  isPumpActive,
  onTriggerPump,
  targetMoisture,
  setTargetMoisture,
  onRefillTank,
  rainDetected,
  sensorData,
  lowMoistureThreshold
}) {
  const [totalWaterDeliveredMl, setTotalWaterDeliveredMl] = useState(420);
  const wasPumpActiveRef = useRef(isPumpActive);

  const moistureDeficit = Math.max(0, targetMoisture - sensorData.soilMoisture);
  const tempFactor = Math.max(1, sensorData.temperature / 20);
  const lightFactor = Math.max(1, sensorData.light / 500);
  const waterCalculatedMl = Math.round(moistureDeficit * 4.5 * tempFactor * lightFactor);

  useEffect(() => {
    if (isPumpActive && !wasPumpActiveRef.current) {
      setTotalWaterDeliveredMl(total => total + waterCalculatedMl);
    }
    wasPumpActiveRef.current = isPumpActive;
  }, [isPumpActive, waterCalculatedMl]);

  // Current real-time flow rate (mL/s)
  const currentFlowRate = rainDetected ? 0 : isPumpActive ? 35.0 : 0.0;

  return (
    <div className="glass-card controls-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="#10b981" /> Smart Irrigation Controller
        </h3>
        <span style={{
          background: rainDetected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
          color: rainDetected ? '#f87171' : '#34d399',
          border: `1px solid ${rainDetected ? '#ef4444' : '#10b981'}`,
          padding: '0.2rem 0.65rem',
          borderRadius: '12px',
          fontSize: '0.72rem',
          fontWeight: 700
        }}>
          {rainDetected ? '🛑 RAIN STOP LOCKED' : isPumpActive ? '💧 WATERING TO TARGET' : `⚡ STARTS BELOW ${lowMoistureThreshold}%`}
        </span>
      </div>

      {/* Moisture target and real-time flow indicator */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.85rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '0.85rem'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} color="#06b6d4" /> Moisture control:
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: rainDetected ? '#f87171' : 'var(--accent-cyan)', marginTop: '0.2rem' }}>
            {rainDetected ? 'PAUSED' : `${lowMoistureThreshold}% → ${targetMoisture}%`}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            {rainDetected ? 'Rain active: pump stopped' : `Estimated dose: ${waterCalculatedMl} mL`}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Droplets size={13} color="#38bdf8" /> Real-Time Water Flow Rate:
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isPumpActive ? '#38bdf8' : 'var(--text-bright)', marginTop: '0.2rem' }}>
            {currentFlowRate.toFixed(1)} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>mL/s</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Total Delivered: {(totalWaterDeliveredMl / 1000).toFixed(2)} Liters
          </div>
        </div>
      </div>

      {/* Auto / Manual Mode Switch */}
      <div className="toggle-row">
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Smart Auto Irrigation</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Starts below {lowMoistureThreshold}% and waters to the selected target, up to 60%.
          </div>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={isAutoMode}
            onChange={(e) => setIsAutoMode(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* Target Soil Moisture Threshold Slider */}
      <div className="control-group">
        <label>
          <span>Target Moisture Threshold:</span>
          <strong style={{ color: 'var(--accent-green-bright)' }}>{targetMoisture}%</strong>
        </label>
        <input
          type="range"
          min={lowMoistureThreshold}
          max={60}
          value={targetMoisture}
          onChange={(e) => setTargetMoisture(Number(e.target.value))}
          className="slider-input"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          <span>{lowMoistureThreshold}% (Start)</span>
          <span>60% (Max target)</span>
        </div>
      </div>

      {/* Manual Pump Trigger Button */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          className={`btn ${isPumpActive ? 'btn-outline' : 'btn-primary'}`}
          style={{ flex: 1 }}
          onClick={onTriggerPump}
          disabled={rainDetected}
        >
          {isPumpActive ? (
            <>
              <Square size={16} color="#ef4444" /> PUMPING WATER...
            </>
          ) : (
            <>
              <Play size={16} /> MANUAL PUMP TO {targetMoisture}%
            </>
          )}
        </button>

        <button className="btn btn-outline" onClick={onRefillTank} title="Refill Water Reservoir Tank">
          <RefreshCw size={16} /> Refill Tank
        </button>
      </div>

      {rainDetected && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '10px',
          padding: '0.65rem 0.85rem',
          fontSize: '0.75rem',
          color: '#f87171',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <ShieldCheck size={18} /> Rain Safety Lock Active: Irrigation strictly stopped (0 mL/s) to prevent overwatering.
        </div>
      )}
    </div>
  );
}
