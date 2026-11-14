import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

export default function AnalyticsCharts({ historyData }) {
  if (!historyData || historyData.length === 0) return null;

  const width = 500;
  const height = 180;
  const padding = 25;

  const pointsMoisture = historyData.map((d, i) => {
    const x = padding + (i / (historyData.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - (d.soilMoisture / 100) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const pointsTemp = historyData.map((d, i) => {
    const x = padding + (i / (historyData.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - (d.temperature / 50) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const lastReading = historyData[historyData.length - 1];

  const hourlyData = [
    { hour: '06:00', liters: 0.8 },
    { hour: '07:00', liters: 1.2 },
    { hour: '08:00', liters: 2.1 },
    { hour: '09:00', liters: 1.7 },
    { hour: '10:00', liters: 2.5 },
    { hour: '11:00', liters: 1.9 },
    { hour: '12:00', liters: 2.8 },
    { hour: '13:00', liters: 2.4 },
    { hour: '14:00', liters: 1.6 },
    { hour: '15:00', liters: 1.1 },
    { hour: '16:00', liters: 0.9 },
    { hour: '17:00', liters: 1.3 }
  ];

  const chartHeight = 140;
  const maxLiters = 3.5;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem', width: '100%' }}>
      
      {/* Left Card: Live Telemetry Waveform */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="#10b981" /> Live Telemetry Analytics
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Real-time sensor waveform & environmental trend</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.72rem' }}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>● Moisture (%)</span>
            <span style={{ color: '#f43f5e', fontWeight: 600 }}>● Temp (°C)</span>
          </div>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
            {/* Grid lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

            {/* Moisture Line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsMoisture}
            />

            {/* Temperature Line */}
            <polyline
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsTemp}
            />

            {/* Dots on last data point */}
            {historyData.length > 0 && (
              <circle
                cx={padding + ((historyData.length - 1) / (historyData.length - 1 || 1)) * (width - padding * 2)}
                cy={height - padding - (lastReading.soilMoisture / 100) * (height - padding * 2)}
                r="5"
                fill="#34d399"
              />
            )}
          </svg>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>T-10 Sampling Cycles</span>
          <span>Stream Active</span>
        </div>
      </div>

      {/* Right Card: Hourly Water Consumption Bar Chart */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
              <TrendingUp size={18} /> Hourly Water Consumption
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Automated micro-drip irrigation volume (L/hr)</p>
          </div>
          <div style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '0.2rem 0.55rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
            Avg: 1.42 L/hr
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '12px', padding: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: `${chartHeight}px`, gap: '6px' }}>
            {hourlyData.map((item, idx) => {
              const barHeightPercent = (item.liters / maxLiters) * 100;
              const isCurrentHour = idx === hourlyData.length - 1;

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.6rem', color: isCurrentHour ? '#38bdf8' : '#94a3b8', fontWeight: 600, marginBottom: '3px' }}>
                    {item.liters}L
                  </span>
                  <div
                    style={{
                      width: '100%',
                      height: `${barHeightPercent}%`,
                      background: isCurrentHour
                        ? 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)'
                        : 'linear-gradient(180deg, rgba(56, 189, 248, 0.7) 0%, rgba(14, 165, 233, 0.3) 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease',
                      boxShadow: isCurrentHour ? '0 0 10px rgba(56, 189, 248, 0.5)' : 'none'
                    }}
                    title={`${item.hour} - ${item.liters} Liters consumed`}
                  />
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                    {item.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>12-Hour Telemetry History</span>
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>Total: 20.3 L Today</span>
        </div>
      </div>

    </div>
  );
}
