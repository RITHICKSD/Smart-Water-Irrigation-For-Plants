import React from 'react';
import { Sliders, Sun, CloudRain, Thermometer, Droplets, Sparkles } from 'lucide-react';

export default function SensorSimulator({ sensorData, setSensorData }) {
  const handleChange = (key, value) => {
    setSensorData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyPreset = (preset) => {
    if (preset === 'drought') {
      setSensorData(prev => ({ ...prev, soilMoisture: 25, temperature: 36, humidity: 30, light: 950, rainDetected: false }));
    } else if (preset === 'rain') {
      setSensorData(prev => ({ ...prev, soilMoisture: 75, temperature: 20, humidity: 88, light: 250, rainDetected: true }));
    } else if (preset === 'ideal') {
      setSensorData(prev => ({ ...prev, soilMoisture: 58, temperature: 24, humidity: 60, light: 650, rainDetected: false }));
    } else if (preset === 'night') {
      setSensorData(prev => ({ ...prev, soilMoisture: 50, temperature: 18, humidity: 70, light: 50, rainDetected: false }));
    }
  };

  return (
    <div className="glass-card controls-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={18} color="#06b6d4" /> Micro-Climate Environment Simulator
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Testing</span>
      </div>

      {/* Preset Quick Actions */}
      <div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Quick Scenario Simulation Presets:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }} onClick={() => applyPreset('drought')}>
            🔥 Sunny Drought
          </button>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }} onClick={() => applyPreset('rain')}>
            🌧️ Rain Storm
          </button>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }} onClick={() => applyPreset('ideal')}>
            🌿 Ideal Spring
          </button>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }} onClick={() => applyPreset('night')}>
            🌙 Cool Night
          </button>
        </div>
      </div>

      {/* Moisture Slider */}
      <div className="control-group">
        <label>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Droplets size={14} color="#38bdf8" /> Soil Moisture</span>
          <strong>{sensorData.soilMoisture}%</strong>
        </label>
        <input
          type="range"
          min={5}
          max={100}
          value={sensorData.soilMoisture}
          onChange={(e) => handleChange('soilMoisture', Number(e.target.value))}
          className="slider-input"
        />
      </div>

      {/* Temperature Slider */}
      <div className="control-group">
        <label>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Thermometer size={14} color="#f43f5e" /> Temperature</span>
          <strong>{sensorData.temperature}°C</strong>
        </label>
        <input
          type="range"
          min={10}
          max={45}
          value={sensorData.temperature}
          onChange={(e) => handleChange('temperature', Number(e.target.value))}
          className="slider-input"
        />
      </div>

      {/* Light Intensity Slider */}
      <div className="control-group">
        <label>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Sun size={14} color="#f59e0b" /> Light Intensity</span>
          <strong>{sensorData.light} Lux</strong>
        </label>
        <input
          type="range"
          min={0}
          max={1000}
          step={20}
          value={sensorData.light}
          onChange={(e) => handleChange('light', Number(e.target.value))}
          className="slider-input"
        />
      </div>

      {/* Rain Toggle Switch */}
      <div className="toggle-row">
        <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CloudRain size={16} color="#38bdf8" /> Trigger Rain Drops
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={sensorData.rainDetected}
            onChange={(e) => handleChange('rainDetected', e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
}
