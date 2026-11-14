import React from 'react';
import { Sprout, Wifi, WifiOff, RefreshCw, Sparkles, Moon, Sun } from 'lucide-react';

export default function Navbar({ activePlant, onOpenPlantModal, isConnected, isAutoMode }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="logo-badge">
          <Sprout size={26} />
        </div>
        <div className="brand-text">
          <h1>SmartPlant <span>EcoVerse</span></h1>
          <p className="brand-subtitle">React IoT Water & Micro-Climate Control</p>
        </div>
      </div>

      <div className="active-plant-pill" title="Target species profile">
        <span className="plant-emoji">{activePlant.emoji}</span>
        <div className="plant-details">
          <span className="name">{activePlant.shortName}</span>
          <span className="status-tag">
            <Sparkles size={12} /> Target: {activePlant.minMoisture}-{activePlant.maxMoisture}% SM
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className={`conn-pill ${isConnected ? 'online' : ''}`}>
          {isConnected ? (
            <>
              <span className="dot connected"></span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>Backend WebSocket</span>
            </>
          ) : (
            <>
              <span className="dot" style={{ background: '#38bdf8' }}></span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Simulated IoT Mode</span>
            </>
          )}
        </div>

        <div style={{
          background: isAutoMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
          border: `1px solid ${isAutoMode ? '#10b981' : '#f59e0b'}`,
          color: isAutoMode ? '#34d399' : '#f59e0b',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          {isAutoMode ? '⚡ AUTO PUMP ON' : '✋ MANUAL CONTROL'}
        </div>
      </div>
    </nav>
  );
}
