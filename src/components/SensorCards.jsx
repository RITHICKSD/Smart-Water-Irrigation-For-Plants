import React from 'react';
import { Droplets, Thermometer, Sun, CloudRain, Gauge, Container } from 'lucide-react';

export default function SensorCards({ sensorData, plant, hasReceivedData, isMoistureSimulated, targetMoisture }) {
  const { soilMoisture, temperature, humidity, light, rainDetected, waterLevel = 85 } = sensorData;
  const readingStatus = hasReceivedData ? 'Live reading from ESP32' : 'Waiting for Wokwi sensor data';
  const readingStatusColor = hasReceivedData ? '#34d399' : 'var(--text-muted)';

  const getMoistureStatus = (val) => {
    if (val < plant.minMoisture) return { text: 'Low (Needs Water)', color: '#f59e0b' };
    if (val > plant.maxMoisture) return { text: 'High (Waterlogged)', color: '#38bdf8' };
    return { text: 'Optimal Range', color: '#10b981' };
  };

  const moistureStatus = getMoistureStatus(soilMoisture);

  return (
    <div className="sensor-grid">
      {/* 1. Soil Moisture Gauge (YL-69 Sensor) */}
      <div className="glass-card sensor-card" style={{ '--card-accent': moistureStatus.color }}>
        <div className="sensor-card-top">
          <span className="sensor-title">Soil Moisture (YL-69)</span>
          <div className="sensor-icon"><Droplets size={20} /></div>
        </div>
        <div>
          <span className="sensor-value">{soilMoisture}</span>
          <span className="sensor-unit">%</span>
        </div>
        <div className="sensor-bar-bg">
          <div className="sensor-bar-fill" style={{ width: `${Math.min(100, Math.max(0, soilMoisture))}%` }}></div>
        </div>
        <div style={{ fontSize: '0.72rem', color: moistureStatus.color, fontWeight: 600 }}>
          {moistureStatus.text}
        </div>
        {isMoistureSimulated && (
          <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
            Simulated watering toward {targetMoisture}%
          </div>
        )}
      </div>

      {/* 2. Temperature Sensor (DHT11) */}
      <div className="glass-card sensor-card" style={{ '--card-accent': '#f43f5e' }}>
        <div className="sensor-card-top">
          <span className="sensor-title">Temperature (DHT11)</span>
          <div className="sensor-icon" style={{ color: '#f43f5e' }}><Thermometer size={20} /></div>
        </div>
        <div>
          <span className="sensor-value">{temperature}</span>
          <span className="sensor-unit">°C</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: readingStatusColor, fontWeight: 600 }}>
          {readingStatus}
        </div>
        <div className="sensor-bar-bg">
          <div className="sensor-bar-fill" style={{ width: `${(temperature / 50) * 100}%`, background: '#f43f5e' }}></div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Ideal: {plant.idealTemp}°C | Heat Index Normal
        </div>
      </div>

      {/* 3. Relative Humidity (DHT11) */}
      <div className="glass-card sensor-card" style={{ '--card-accent': '#06b6d4' }}>
        <div className="sensor-card-top">
          <span className="sensor-title">Air Humidity (DHT11)</span>
          <div className="sensor-icon" style={{ color: '#06b6d4' }}><Gauge size={20} /></div>
        </div>
        <div>
          <span className="sensor-value">{humidity}</span>
          <span className="sensor-unit">% RH</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: readingStatusColor, fontWeight: 600 }}>
          {readingStatus}
        </div>
        <div className="sensor-bar-bg">
          <div className="sensor-bar-fill" style={{ width: `${humidity}%`, background: '#06b6d4' }}></div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Ambient Vapor Pressure Normal
        </div>
      </div>

      {/* 4. Light Level (LDR Photoresistor) */}
      <div className="glass-card sensor-card" style={{ '--card-accent': '#f59e0b' }}>
        <div className="sensor-card-top">
          <span className="sensor-title">Sunlight (LDR Sensor)</span>
          <div className="sensor-icon" style={{ color: '#f59e0b' }}><Sun size={20} /></div>
        </div>
        <div>
          <span className="sensor-value">{light}</span>
          <span className="sensor-unit">Lux</span>
        </div>
        <div className="sensor-bar-bg">
          <div className="sensor-bar-fill" style={{ width: `${Math.min(100, (light / 1000) * 100)}%`, background: '#f59e0b' }}></div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {light > 600 ? 'Full Daylight' : light > 300 ? 'Moderate Shade' : 'Low Light'}
        </div>
      </div>

      {/* 5. Rain Drop Detector (FC-37) */}
      <div className="glass-card sensor-card" style={{ '--card-accent': rainDetected ? '#38bdf8' : '#64748b' }}>
        <div className="sensor-card-top">
          <span className="sensor-title">Rain Detector (FC-37)</span>
          <div className="sensor-icon" style={{ color: rainDetected ? '#38bdf8' : '#64748b' }}><CloudRain size={20} /></div>
        </div>
        <div>
          <span className="sensor-value" style={{ fontSize: '1.25rem', color: rainDetected ? '#38bdf8' : 'var(--text-bright)' }}>
            {rainDetected ? 'RAINING' : 'DRY'}
          </span>
        </div>
        <div className="sensor-bar-bg">
          <div className="sensor-bar-fill" style={{ width: rainDetected ? '100%' : '5%', background: rainDetected ? '#38bdf8' : '#64748b' }}></div>
        </div>
        <div style={{ fontSize: '0.72rem', color: rainDetected ? '#38bdf8' : 'var(--text-muted)' }}>
          {rainDetected ? 'Auto-suspending pump' : 'No Precipitation'}
        </div>
      </div>

      {/* 6. Water Tank Level */}
      <div className="glass-card sensor-card" style={{ '--card-accent': '#10b981' }}>
        <div className="sensor-card-top">
          <span className="sensor-title">Water Reservoir</span>
          <div className="sensor-icon" style={{ color: '#10b981' }}><Container size={20} /></div>
        </div>
        <div>
          <span className="sensor-value">{waterLevel}</span>
          <span className="sensor-unit">%</span>
        </div>
        <div className="sensor-bar-bg">
          <div className="sensor-bar-fill" style={{ width: `${waterLevel}%`, background: '#10b981' }}></div>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {(waterLevel * 0.05).toFixed(1)} Liters Remaining
        </div>
      </div>
    </div>
  );
}
