import React from 'react';
import { BookOpen, Cpu, ShieldCheck, Printer, FileText, CheckCircle2 } from 'lucide-react';

export default function EVSProjectReport({ activePlant }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={22} color="#10b981" /> EVS Academic Project Report & Documentation
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Smart Plant Water Management & Living Environment System
          </p>
        </div>
        <button className="btn btn-outline" onClick={handlePrint}>
          <Printer size={16} /> Print / Export PDF
        </button>
      </div>

      {/* Grid of EVS Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        {/* 1. Problem Statement */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-green-bright)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={16} /> 1. Environmental Problem Statement
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Conventional agricultural irrigation relies on fixed timers or continuous flooding, wasting up to 60% of applied water due to evaporation, runoff, and deep percolation. This practice depletes local aquifers and damages plant health via root rot.
          </p>
        </div>

        {/* 2. System Hardware Overview */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-blue-bright)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Cpu size={16} /> 2. IoT Architecture & Hardware
          </h3>
          <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '1.2rem' }}>
            <li><strong>YL-69 Sensor:</strong> Measures volumetric soil water contents.</li>
            <li><strong>FC-37 Sensor:</strong> Detects raindrops & overrides irrigation.</li>
            <li><strong>DHT11:</strong> Tracks micro-climate temperature & air humidity.</li>
            <li><strong>5V Relays & Drip Pump:</strong> Delivers micro-targeted water drops.</li>
          </ul>
        </div>

        {/* 3. Closed-Loop Algorithm */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} /> 3. Feedback Control Logic
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            The microcontroller evaluates: <br />
            <code>IF (Rain == FALSE) AND (SoilMoisture &lt; TargetMoisture) THEN Activate Pump FOR 3 Seconds ELSE Standby</code>
          </p>
        </div>

        {/* 4. Ecological Impact Summary */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#06b6d4', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} /> 4. Sustainability Key Metrics
          </h3>
          <ul style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '1.2rem' }}>
            <li>Conserves ~45% of irrigation freshwater.</li>
            <li>Eliminates soil nutrient leaching.</li>
            <li>Reduces water pump grid electricity footprint.</li>
            <li>Ensures optimal plant photosynthesis & respiration.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
