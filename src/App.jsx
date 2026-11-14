import React, { useState, useEffect, useRef, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import PlantVisualizerCanvas from './components/PlantVisualizerCanvas';
import SensorCards from './components/SensorCards';
import SmartControls from './components/SmartControls';
import SensorSimulator from './components/SensorSimulator';
import AnalyticsCharts from './components/AnalyticsCharts';
import WaterConservationCalc from './components/WaterConservationCalc';
import EVSProjectReport from './components/EVSProjectReport';
import PlantSelectorModal from './components/PlantSelectorModal';
import { PLANT_SPECIES } from './data/plants';
import { AlertTriangle, CloudRain, Droplets, BookOpen, Sliders, Activity, WifiOff, Radio } from 'lucide-react';

const LOW_MOISTURE_THRESHOLD = 40;
const MAX_TARGET_MOISTURE = 60;

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activePlant, setActivePlant] = useState(PLANT_SPECIES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'report'

  // Live IoT Sensor State (Defaults to optimal hydration)
  const [sensorData, setSensorData] = useState({
    plant: 'Tomato',
    soilMoisture: 55,
    temperature: 25,
    humidity: 60,
    light: 650,
    rainDetected: false,
    waterLevel: 85,
    timestamp: Date.now()
  });
  const [hasReceivedData, setHasReceivedData] = useState(false);

  // Automated Pump State & Rules
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isPumpActive, setIsPumpActive] = useState(false);
  const [targetMoisture, setTargetMoisture] = useState(MAX_TARGET_MOISTURE);
  const [simulatedMoisture, setSimulatedMoisture] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const wsRef = useRef(null);
  const pumpIntervalRef = useRef(null);
  const isPumpActiveRef = useRef(false);
  const lowMoistureCycleRef = useRef(false);
  const simulatedMoistureRef = useRef(null);
  const displayedSensorData = {
    ...sensorData,
    soilMoisture: simulatedMoisture ?? sensorData.soilMoisture
  };
  const displayedSensorDataRef = useRef(displayedSensorData);
  displayedSensorDataRef.current = displayedSensorData;

  const stopPump = useCallback(() => {
    if (pumpIntervalRef.current) {
      clearInterval(pumpIntervalRef.current);
      pumpIntervalRef.current = null;
    }
    isPumpActiveRef.current = false;
    setIsPumpActive(false);
  }, []);

  const triggerPump = useCallback(() => {
    if (
      sensorData.rainDetected ||
      sensorData.waterLevel <= 5 ||
      isPumpActiveRef.current
    ) {
      return;
    }

    const pumpTarget = Math.min(targetMoisture, MAX_TARGET_MOISTURE);
    const startingMoisture = simulatedMoistureRef.current ?? sensorData.soilMoisture;
    if (startingMoisture >= pumpTarget) return;

    if (sensorData.soilMoisture < LOW_MOISTURE_THRESHOLD) {
      lowMoistureCycleRef.current = true;
    }

    isPumpActiveRef.current = true;
    setIsPumpActive(true);
    simulatedMoistureRef.current = startingMoisture;
    setSimulatedMoisture(startingMoisture);

    pumpIntervalRef.current = setInterval(() => {
      const currentMoisture = simulatedMoistureRef.current ?? startingMoisture;
      const nextMoisture = Math.min(pumpTarget, currentMoisture + 3);
      simulatedMoistureRef.current = nextMoisture;
      setSimulatedMoisture(nextMoisture);
      setSensorData(prev => ({
        ...prev,
        waterLevel: Math.max(0, prev.waterLevel - 1.5)
      }));

      if (nextMoisture >= pumpTarget) {
        stopPump();
      }
    }, 400);
  }, [sensorData.rainDetected, sensorData.soilMoisture, sensorData.waterLevel, stopPump, targetMoisture]);

  const applySensorUpdate = (data) => {
    const { plant, ...rest } = data;
    if (
      typeof rest.soilMoisture === 'number' &&
      rest.soilMoisture >= LOW_MOISTURE_THRESHOLD &&
      !isPumpActiveRef.current
    ) {
      lowMoistureCycleRef.current = false;
      simulatedMoistureRef.current = null;
      setSimulatedMoisture(null);
    }
    setSensorData(prev => ({ ...prev, ...rest }));
  };

  // 1. Establish WebSocket & HTTP Telemetry Sync with Server
  useEffect(() => {
    let ws;
    const fetchLatestSensors = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/sensors');
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.timestamp) {
            setIsConnected(true);
            // Only mark as received if Wokwi has updated it in the last 15 seconds
            const isFresh = (Date.now() - json.data.timestamp) < 15000;
            setHasReceivedData(isFresh);
            if (isFresh) {
              applySensorUpdate(json.data);
            }
          }
        }
      } catch (err) {
        // Fallback relative URL
        try {
          const res = await fetch('/api/sensors');
          if (res.ok) {
            const json = await res.json();
            if (json.data && json.data.timestamp) {
              setIsConnected(true);
              const isFresh = (Date.now() - json.data.timestamp) < 15000;
              setHasReceivedData(isFresh);
              if (isFresh) {
                applySensorUpdate(json.data);
              }
            }
          }
        } catch (e) {}
      }
    };

    // Initial fetch + 800ms polling loop
    fetchLatestSensors();
    const pollInterval = setInterval(fetchLatestSensors, 800);

    // Also establish WebSocket for instant zero-latency pushes
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.hostname}:3000`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => setIsConnected(true);
      ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          if (payload.type === 'sensor_update' && payload.data) {
            setIsConnected(true);
            const isFresh = (Date.now() - payload.data.timestamp) < 15000;
            setHasReceivedData(isFresh);
            if (isFresh) {
              applySensorUpdate(payload.data);
            }
          }
        } catch (e) {}
      };
      ws.onerror = () => {};
      ws.onclose = () => {};
      wsRef.current = ws;
    } catch (err) {}

    return () => {
      clearInterval(pollInterval);
      if (ws) ws.close();
    };
  }, []);

  // 2. Start simulated irrigation when live moisture falls below 40%.
  useEffect(() => {
    if (
      isAutoMode &&
      !sensorData.rainDetected &&
      sensorData.soilMoisture < LOW_MOISTURE_THRESHOLD &&
      sensorData.waterLevel > 5 &&
      !isPumpActive &&
      !lowMoistureCycleRef.current
    ) {
      lowMoistureCycleRef.current = true;
      triggerPump();
    }
  }, [sensorData.soilMoisture, sensorData.rainDetected, sensorData.waterLevel, isAutoMode, isPumpActive, triggerPump]);

  useEffect(() => {
    if (sensorData.rainDetected) {
      lowMoistureCycleRef.current = false;
      if (isPumpActiveRef.current) {
        stopPump();
        simulatedMoistureRef.current = null;
        setSimulatedMoisture(null);
      }
    }
  }, [sensorData.rainDetected, stopPump]);

  useEffect(() => () => {
    if (pumpIntervalRef.current) clearInterval(pumpIntervalRef.current);
  }, []);

  // 3. Telemetry History Collector
  useEffect(() => {
    const interval = setInterval(() => {
      setHistoryData(prev => {
        const next = [...prev, { ...displayedSensorDataRef.current, time: new Date().toLocaleTimeString() }];
        return next.slice(-20); // Keep last 20 ticks
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefillTank = () => {
    setSensorData(prev => ({ ...prev, waterLevel: 100 }));
  };

  const handleSelectPlant = (plant) => {
    setActivePlant(plant);
    setTargetMoisture(MAX_TARGET_MOISTURE);
    setSensorData(prev => ({ ...prev, plant: plant.shortName }));
  };

  if (showLanding) {
    return <LandingPage onLaunchSimulation={() => setShowLanding(false)} />;
  }

  return (
    <div className="app-wrapper">
      <Navbar
        activePlant={activePlant}
        onOpenPlantModal={() => setIsModalOpen(true)}
        isConnected={isConnected}
        isAutoMode={isAutoMode}
      />

      <div className="main-layout">
        {/* Left / Center Main Content */}
        <div className="center-column">
          
          {/* Rain Alert Banner */}
          {sensorData.rainDetected && (
            <div className="alert-banner rain">
              <div className="alert-icon"><CloudRain size={20} /></div>
              <div className="alert-text">
                <h4>🌧️ Rain Drop Sensor (FC-37) Triggered</h4>
                <p>Natural precipitation detected. Smart Irrigation Pump is automatically suspended to prevent waterlogging & conserve groundwater.</p>
              </div>
            </div>
          )}

          {/* Moisture Dry Warning Banner */}
          {displayedSensorData.soilMoisture < LOW_MOISTURE_THRESHOLD && !sensorData.rainDetected && (
            <div className="alert-banner warning">
              <div className="alert-icon"><AlertTriangle size={20} /></div>
              <div className="alert-text">
                <h4>⚠️ Low Soil Moisture Level ({displayedSensorData.soilMoisture}%)</h4>
                <p>Soil moisture is below 40%. {isAutoMode ? `Automatic watering is targeting ${targetMoisture}%.` : 'Requires manual irrigation.'}</p>
              </div>
            </div>
          )}

          {/* Canvas Plant Visualizer */}
          <PlantVisualizerCanvas
            plant={activePlant}
            moisture={displayedSensorData.soilMoisture}
            light={displayedSensorData.light}
            rainDetected={sensorData.rainDetected}
            isPumpActive={isPumpActive}
          />

          {/* Sensor Gauges Grid */}
          <SensorCards
            sensorData={displayedSensorData}
            plant={activePlant}
            hasReceivedData={hasReceivedData}
            isMoistureSimulated={simulatedMoisture !== null}
            targetMoisture={targetMoisture}
          />

          {/* Automated Pump Controller */}
          <SmartControls
            isAutoMode={isAutoMode}
            setIsAutoMode={setIsAutoMode}
            isPumpActive={isPumpActive}
            onTriggerPump={triggerPump}
            targetMoisture={targetMoisture}
            setTargetMoisture={setTargetMoisture}
            onRefillTank={handleRefillTank}
            rainDetected={sensorData.rainDetected}
            sensorData={displayedSensorData}
            lowMoistureThreshold={LOW_MOISTURE_THRESHOLD}
          />

          {/* Navigation Tabs for Analytics vs Academic EVS Report */}
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div className="tab-navigation">
              <button
                className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <Activity size={16} /> Live Charts & Waveforms
              </button>
              <button
                className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
                onClick={() => setActiveTab('report')}
              >
                <BookOpen size={16} /> EVS Academic Report & Specs
              </button>
            </div>

            {activeTab === 'analytics' && (
              <AnalyticsCharts historyData={historyData} />
            )}

            {activeTab === 'report' && (
              <EVSProjectReport activePlant={activePlant} />
            )}
          </div>

        </div>

        {/* Right Sidebar Column */}
        <div className="side-column">
          <WaterConservationCalc sensorData={displayedSensorData} plant={activePlant} />

          {/* Plant Specs Quick Card */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{activePlant.emoji}</span> {activePlant.shortName} Profile
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
              {activePlant.description}
            </p>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.75rem', color: '#34d399' }}>
              <strong>EVS Insight:</strong> {activePlant.evsFact}
            </div>
          </div>
        </div>
      </div>

      <PlantSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activePlant={activePlant}
        onSelectPlant={handleSelectPlant}
      />
    </div>
  );
}
