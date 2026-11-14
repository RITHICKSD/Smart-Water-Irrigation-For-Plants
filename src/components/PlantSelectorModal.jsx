import React from 'react';
import { PLANT_SPECIES } from '../data/plants';
import { X, Check } from 'lucide-react';

export default function PlantSelectorModal({ isOpen, onClose, activePlant, onSelectPlant }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Select Plant Species</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Initialize personalized soil moisture thresholds & micro-climate profiles.
            </p>
          </div>
          <button className="btn-outline" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="plant-options-grid">
          {PLANT_SPECIES.map((p) => {
            const isSelected = activePlant.id === p.id;
            return (
              <div
                key={p.id}
                className={`plant-option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onSelectPlant(p);
                  onClose();
                }}
              >
                <div className="emoji">{p.emoji}</div>
                <h4>{p.shortName}</h4>
                <p>{p.category}</p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--accent-green-bright)', fontWeight: 600 }}>
                  Target: {p.minMoisture}%-{p.maxMoisture}% SM
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
