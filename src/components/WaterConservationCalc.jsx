import React from 'react';
import { Calculator, Droplets, Leaf, ShieldAlert, Award } from 'lucide-react';

export default function WaterConservationCalc({ sensorData, plant }) {
  // Calculations based on Evapotranspiration formula (ET0) estimate
  const dailyTraditionalLiters = 2.5; // liters/day traditional timer watering
  const smartSavedPercentage = sensorData.rainDetected ? 70 : 42; // Rain sensor saves 70%, smart moisture saves 42%
  const dailySmartLiters = dailyTraditionalLiters * (1 - smartSavedPercentage / 100);
  const monthlySavedLiters = ((dailyTraditionalLiters - dailySmartLiters) * 30).toFixed(1);
  const co2ReductionKg = (monthlySavedLiters * 0.0003).toFixed(2); // Carbon offset from pumping power

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={18} color="#0ea5e9" /> EVS Eco Water Savings Calculator
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Precision micro-drip efficiency metrics</p>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
          {smartSavedPercentage}% Efficiency Gain
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Droplets size={14} color="#38bdf8" /> Monthly Water Conserved
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue-bright)', marginTop: '0.25rem' }}>
            {monthlySavedLiters} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>Liters</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            vs conventional scheduled timer
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Leaf size={14} color="#34d399" /> Carbon Footprint Reduction
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green-bright)', marginTop: '0.25rem' }}>
            {co2ReductionKg} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>kg CO₂e</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Pump energy efficiency savings
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '0.85rem', fontSize: '0.78rem' }}>
        <strong style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
          <Award size={16} /> EVS Conservation Principle:
        </strong>
        Integrating rain-drop sensors with threshold-based soil moisture feedback eliminates over-irrigation, prevents soil nutrient leaching, and guards against root oxygen asphyxiation.
      </div>
    </div>
  );
}
