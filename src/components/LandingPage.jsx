import React from 'react';
import { Play, Sprout, ArrowRight, ShieldCheck, Sparkles, Cpu, Activity } from 'lucide-react';

export default function LandingPage({ onLaunchSimulation }) {
  return (
    <div className="landing-hero-container">
      {/* Background Image with Overlay */}
      <div className="video-background-wrapper">
        <img
          src="/gem.jpg"
          alt="Smart Greenhouse Environment"
          className="hero-background-video"
          onError={(e) => {
            // Fallback to gem.png artifact if local public image isn't available
            e.target.src = "file:///C:/Users/ADMIN/.gemini/antigravity-ide/brain/9e4f267a-70fd-42a1-830d-fa3f235a9c87/gem_1791469165771.png";
          }}
        />
        {/* Dark Cinematic Gradient Overlay */}
        <div className="hero-video-overlay" />
      </div>

      {/* Floating Header Brand */}
      <header className="landing-header">
        <div className="landing-logo">
          <div className="logo-icon-glow">
            <Sprout size={28} />
          </div>
          <span className="logo-text">EcoVerse<span className="logo-accent">IoT</span></span>
        </div>
        <div className="header-badge">
          <Cpu size={14} className="pulse-icon" /> ESP32 Real-Time Telemetry
        </div>
      </header>

      {/* Center Hero Section */}
      <main className="hero-content">
        <div className="hero-pill-tag">
          <Sparkles size={14} color="#10b981" /> Environmental Science & Smart Agriculture Project
        </div>

        <h1 className="hero-title">
          SMART PLANT <br />
          <span className="gradient-text">ECO-SYSTEM</span>
        </h1>

        <p className="hero-subtitle">
          Closed-Loop Precision Irrigation & Micro-Climate Control Dashboard powered by Wokwi ESP32 IoT Simulation, Real-Time Sensor Telemetry, and EVS Water Conservation Analytics.
        </p>

        {/* Primary Action Button */}
        <div className="hero-cta-group">
          <button className="btn-launch-simulation" onClick={onLaunchSimulation}>
            <span className="btn-glow" />
            <span className="btn-content">
              <Play size={20} fill="currentColor" /> Live Simulation
              <ArrowRight size={20} className="arrow-icon" />
            </span>
          </button>
        </div>

        {/* Feature Pills */}
        <div className="hero-features-grid">
          <div className="hero-feature-card">
            <Activity size={20} color="#34d399" />
            <div>
              <h5>Live Telemetry</h5>
              <p>DHT22, YL-69 Soil & LDR Lux Sync</p>
            </div>
          </div>

          <div className="hero-feature-card">
            <ShieldCheck size={20} color="#38bdf8" />
            <div>
              <h5>Rain Safety Lock</h5>
              <p>FC-37 Drop Protection System</p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Credits */}
      <footer className="landing-footer">
        <span>© 2026 EVS IoT Project — Next-Gen Precision Agriculture</span>
        <span className="status-live">● System Operational</span>
      </footer>
    </div>
  );
}
