/* ==========================================================================
   SMART PLANT WATER MANAGEMENT & VIRTUAL ECOSYSTEM - CLIENT CORE JS
   ========================================================================== */

// Plant Database
const PLANT_SPECIES = [
  {
    id: 'tomato',
    name: 'Tomato',
    emoji: '🍅',
    category: 'Vegetable / Solanaceae',
    waterReq: 'Moderate-High',
    waterReqLevel: 3,
    idealTempMin: 20,
    idealTempMax: 30,
    idealMoistureMin: 50,
    idealMoistureMax: 70,
    color: '#ff4757',
    description: 'Requires consistent moisture and bright sunlight for luscious fruit development.',
    soilType: 'Loamy, well-draining pH 6.0 - 6.8',
    sunlight: 'Full Sun (6-8 hrs/day)',
    careTips: 'Prune suckers to improve airflow. Maintain target 60% soil moisture during fruit set.'
  },
  {
    id: 'rose',
    name: 'Rose',
    emoji: '🌹',
    category: 'Flowering Shrub',
    waterReq: 'Moderate',
    waterReqLevel: 2,
    idealTempMin: 18,
    idealTempMax: 28,
    idealMoistureMin: 45,
    idealMoistureMax: 65,
    color: '#e84118',
    description: 'Thrives in rich organic soil with moderate watering and deep root hydration.',
    soilType: 'Rich in organic compost, moist loam',
    sunlight: 'Direct sunlight 6 hours daily',
    careTips: 'Water at soil level early morning to prevent black spot foliage fungus.'
  },
  {
    id: 'aloe',
    name: 'Aloe Vera',
    emoji: '🌵',
    category: 'Succulent',
    waterReq: 'Low',
    waterReqLevel: 1,
    idealTempMin: 15,
    idealTempMax: 35,
    idealMoistureMin: 20,
    idealMoistureMax: 40,
    color: '#2ed573',
    description: 'Drought tolerant succulent storing water in thick fleshy leaves. Sensitive to overwatering.',
    soilType: 'Cactus & succulent coarse sandy mix',
    sunlight: 'Bright indirect light',
    careTips: 'Allow soil to dry out completely between waterings to prevent root rot.'
  },
  {
    id: 'basil',
    name: 'Basil',
    emoji: '🌿',
    category: 'Aromatic Herb',
    waterReq: 'High',
    waterReqLevel: 3,
    idealTempMin: 20,
    idealTempMax: 28,
    idealMoistureMin: 60,
    idealMoistureMax: 80,
    color: '#10b981',
    description: 'Loves warmth and moist soil. Pinch top leaves to promote bushy leafy growth.',
    soilType: 'Moist, fertile loamy soil',
    sunlight: '6-8 hours sun daily',
    careTips: 'Keep soil evenly moist. Water whenever top inch feels dry.'
  },
  {
    id: 'mint',
    name: 'Mint',
    emoji: '🌱',
    category: 'Perennial Herb',
    waterReq: 'High',
    waterReqLevel: 3,
    idealTempMin: 15,
    idealTempMax: 25,
    idealMoistureMin: 60,
    idealMoistureMax: 80,
    color: '#00d2d3',
    description: 'Vigorous growing herb that enjoys cool damp conditions and constant soil moisture.',
    soilType: 'Rich, damp organic soil',
    sunlight: 'Partial shade to full sun',
    careTips: 'Mint absorbs water rapidly. High moisture warning triggers rarely damage mint.'
  },
  {
    id: 'chilli',
    name: 'Chilli Pepper',
    emoji: '🌶️',
    category: 'Spice / Solanaceae',
    waterReq: 'Moderate',
    waterReqLevel: 2,
    idealTempMin: 22,
    idealTempMax: 32,
    idealMoistureMin: 40,
    idealMoistureMax: 60,
    color: '#ff6b6b',
    description: 'Enjoys warm tropical heat. Moderate stress on moisture enhances pepper spiciness!',
    soilType: 'Well-aerated sandy loam',
    sunlight: 'Full bright sunlight',
    careTips: 'Avoid overwatering once flowers set; slight dry cycle improves fruit capsaicin.'
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    emoji: '🥒',
    category: 'Vining Cucurbit',
    waterReq: 'High',
    waterReqLevel: 4,
    idealTempMin: 22,
    idealTempMax: 30,
    idealMoistureMin: 65,
    idealMoistureMax: 85,
    color: '#26de81',
    description: 'High water requirement plant (95% water content in fruits). Deep watering essential.',
    soilType: 'Warm, rich fertile soil with compost',
    sunlight: 'Full morning sun',
    careTips: 'Inconsistent watering causes bitter tasting cucumbers. Keep pump active.'
  },
  {
    id: 'snake',
    name: 'Snake Plant',
    emoji: '🪴',
    category: 'Air Purifying Evergreen',
    waterReq: 'Very Low',
    waterReqLevel: 1,
    idealTempMin: 18,
    idealTempMax: 32,
    idealMoistureMin: 15,
    idealMoistureMax: 35,
    color: '#20bf6b',
    description: 'Hardy air-purifying plant. Conserves water efficiently via CAM photosynthesis.',
    soilType: 'Free draining potting mix',
    sunlight: 'Adapts from low light to bright indirect',
    careTips: 'Extremely vulnerable to overwatering. Auto-pump interval should be prolonged.'
  }
];

// App State
let state = {
  currentPlant: PLANT_SPECIES[0],
  soilMoisture: 62,
  temperature: 26,
  humidity: 58,
  light: 650,
  rainDetected: false,
  autoPump: true,
  pumpRunning: false,
  healthScore: 96,
  isNight: false,
  simulatedSunHeat: false,
  litersSaved: 14.8,
  preventedEvents: 6,
  telemetryHistory: {
    labels: [],
    moisture: [],
    temp: [],
    humidity: []
  }
};

// WebSocket Reference
let ws = null;
let telemetryChart = null;

// DOM Elements
const plantModalOverlay = document.getElementById('plantModalOverlay');
const plantGrid = document.getElementById('plantGrid');
const btnChangePlant = document.getElementById('btnChangePlant');
const btnToggleTheme = document.getElementById('btnToggleTheme');
const navPlantEmoji = document.getElementById('navPlantEmoji');
const navPlantName = document.getElementById('navPlantName');
const navPlantStatusChip = document.getElementById('navPlantStatusChip');
const connBadge = document.getElementById('connBadge');
const connStatusText = document.getElementById('connStatusText');

// Alerts & Badges
const rainAlertBanner = document.getElementById('rainAlertBanner');
const moistureAlertBanner = document.getElementById('moistureAlertBanner');
const healthScoreChip = document.getElementById('healthScoreChip');
const weatherChip = document.getElementById('weatherChip');

// Sensor Displays
const valMoisture = document.getElementById('valMoisture');
const barMoisture = document.getElementById('barMoisture');
const statusMoisture = document.getElementById('statusMoisture');
const targetMoistureRange = document.getElementById('targetMoistureRange');

const valTemp = document.getElementById('valTemp');
const barTemp = document.getElementById('barTemp');
const statusTemp = document.getElementById('statusTemp');
const targetTempRange = document.getElementById('targetTempRange');

const valHumidity = document.getElementById('valHumidity');
const barHumidity = document.getElementById('barHumidity');
const valLight = document.getElementById('valLight');
const barLight = document.getElementById('barLight');

const valRain = document.getElementById('valRain');
const dropAnimBox = document.getElementById('dropAnimBox');
const rainStatusMsg = document.getElementById('rainStatusMsg');

const toggleAutoPump = document.getElementById('toggleAutoPump');
const pumpStateBadge = document.getElementById('pumpStateBadge');
const pumpStateText = document.getElementById('pumpStateText');
const pumpModeLabel = document.getElementById('pumpModeLabel');

// Hardware Controls Sliders
const sliderMoisture = document.getElementById('sliderMoisture');
const simMoistureVal = document.getElementById('simMoistureVal');

const sliderTemp = document.getElementById('sliderTemp');
const simTempVal = document.getElementById('simTempVal');

const sliderHumidity = document.getElementById('sliderHumidity');
const simHumidityVal = document.getElementById('simHumidityVal');

const sliderLight = document.getElementById('sliderLight');
const simLightVal = document.getElementById('simLightVal');

const simToggleRain = document.getElementById('simToggleRain');

// Action Buttons
const btnWaterPlant = document.getElementById('btnWaterPlant');
const btnToggleRain = document.getElementById('btnToggleRain');
const btnToggleSun = document.getElementById('btnToggleSun');

// Eco & AI
const litersSavedVal = document.getElementById('litersSavedVal');
const soilEfficiencyVal = document.getElementById('soilEfficiencyVal');
const preventedEventsVal = document.getElementById('preventedEventsVal');
const ecoTipText = document.getElementById('ecoTipText');

const tabAdvice = document.getElementById('tabAdvice');
const tabSpeciesGuide = document.getElementById('tabSpeciesGuide');
const aiContentBox = document.getElementById('aiContentBox');
const aiAdviceText = document.getElementById('aiAdviceText');
const aiChatInput = document.getElementById('aiChatInput');
const btnSendAiChat = document.getElementById('btnSendAiChat');

// Activity Log
const activityLogList = document.getElementById('activityLogList');
const btnClearLog = document.getElementById('btnClearLog');

// Canvas Initialization
const canvas = document.getElementById('plantCanvas');
const ctx = canvas.getContext('2d');
let animFrameId = null;
let waterParticles = [];
let rainParticles = [];
let windAngle = 0;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  renderPlantGrid();
  initChart();
  setupEventListeners();
  initWebSocket();
  startCanvasAnimation();
  updateUI();
  logActivity('Smart Ecosystem Initialized');
});

/* ========================================== */
/* 1. PLANT SELECTION MODAL LOGIC            */
/* ========================================== */
function renderPlantGrid() {
  plantGrid.innerHTML = '';
  PLANT_SPECIES.forEach(plant => {
    const card = document.createElement('div');
    card.className = 'plant-card';
    card.innerHTML = `
      <div class="plant-icon-box" style="background: ${plant.color}15; color: ${plant.color}">
        ${plant.emoji}
      </div>
      <h3>${plant.name}</h3>
      <div class="category">${plant.category}</div>
      <div class="plant-specs-chips">
        <span class="spec-chip water"><i class="fa-solid fa-droplet"></i> ${plant.waterReq}</span>
        <span class="spec-chip temp"><i class="fa-solid fa-temperature-half"></i> ${plant.idealTempMin}-${plant.idealTempMax}°C</span>
        <span class="spec-chip"><i class="fa-solid fa-seedling"></i> ${plant.idealMoistureMin}-${plant.idealMoistureMax}%</span>
      </div>
      <button class="btn-select-plant">Select & Initialize</button>
    `;

    card.addEventListener('click', () => selectPlant(plant));
    plantGrid.appendChild(card);
  });
}

function selectPlant(plant) {
  state.currentPlant = plant;
  // Close Modal
  plantModalOverlay.classList.remove('active');

  // Set default moisture & temp target defaults
  state.soilMoisture = Math.round((plant.idealMoistureMin + plant.idealMoistureMax) / 2);
  state.temperature = Math.round((plant.idealTempMin + plant.idealTempMax) / 2);

  // Update Controls
  sliderMoisture.value = state.soilMoisture;
  simMoistureVal.textContent = state.soilMoisture + '%';

  sliderTemp.value = state.temperature;
  simTempVal.textContent = state.temperature + '°C';

  logActivity(`Selected plant: ${plant.emoji} ${plant.name}`);
  syncWithServer();
  updateUI();
  renderAiContent('insights');
}

/* ========================================== */
/* 2. WEBSOCKET & BACKEND SYNC                */
/* ========================================== */
function initWebSocket() {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${location.host || 'localhost:3000'}`;

  try {
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      connBadge.className = 'conn-badge';
      connStatusText.textContent = 'Live WebSocket Sync';
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'sensor_update' && msg.data) {
          applyServerData(msg.data);
        }
      } catch (err) {
        console.warn('WS Message Error:', err);
      }
    };

    ws.onclose = () => {
      connBadge.className = 'conn-badge warning';
      connStatusText.textContent = 'Local Simulation Mode';
      setTimeout(initWebSocket, 4000);
    };

    ws.onerror = () => {
      connBadge.className = 'conn-badge warning';
      connStatusText.textContent = 'Local Simulation Mode';
    };
  } catch (e) {
    connStatusText.textContent = 'Local Simulation Mode';
  }
}

function syncWithServer() {
  const payload = {
    plant: state.currentPlant.name,
    soilMoisture: state.soilMoisture,
    temperature: state.temperature,
    humidity: state.humidity,
    light: state.light,
    rainDetected: state.rainDetected
  };

  fetch('/api/sensors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

function applyServerData(data) {
  if (data.soilMoisture !== undefined) {
    state.soilMoisture = data.soilMoisture;
    sliderMoisture.value = data.soilMoisture;
    simMoistureVal.textContent = data.soilMoisture + '%';
  }
  if (data.temperature !== undefined) {
    state.temperature = data.temperature;
    sliderTemp.value = data.temperature;
    simTempVal.textContent = data.temperature + '°C';
  }
  if (data.humidity !== undefined) {
    state.humidity = data.humidity;
    sliderHumidity.value = data.humidity;
    simHumidityVal.textContent = data.humidity + '%';
  }
  if (data.light !== undefined) {
    state.light = data.light;
    sliderLight.value = data.light;
    simLightVal.textContent = data.light + ' Lux';
  }
  if (data.rainDetected !== undefined) {
    state.rainDetected = data.rainDetected;
    simToggleRain.checked = data.rainDetected;
  }
  updateUI();
}

/* ========================================== */
/* 3. EVENT LISTENERS                         */
/* ========================================== */
function setupEventListeners() {
  btnChangePlant.addEventListener('click', () => {
    plantModalOverlay.classList.add('active');
  });

  btnToggleTheme.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    state.isNight = !state.isNight;
    logActivity(`Toggled environment display theme`);
  });

  // Simulator Sliders
  sliderMoisture.addEventListener('input', (e) => {
    state.soilMoisture = parseInt(e.target.value);
    simMoistureVal.textContent = state.soilMoisture + '%';
    evaluateAutomatedPump();
    syncWithServer();
    updateUI();
  });

  sliderTemp.addEventListener('input', (e) => {
    state.temperature = parseInt(e.target.value);
    simTempVal.textContent = state.temperature + '°C';
    syncWithServer();
    updateUI();
  });

  sliderHumidity.addEventListener('input', (e) => {
    state.humidity = parseInt(e.target.value);
    simHumidityVal.textContent = state.humidity + '%';
    syncWithServer();
    updateUI();
  });

  sliderLight.addEventListener('input', (e) => {
    state.light = parseInt(e.target.value);
    simLightVal.textContent = state.light + ' Lux';
    syncWithServer();
    updateUI();
  });

  simToggleRain.addEventListener('change', (e) => {
    setRainState(e.target.checked);
  });

  btnToggleRain.addEventListener('click', () => {
    setRainState(!state.rainDetected);
  });

  btnToggleSun.addEventListener('click', () => {
    state.simulatedSunHeat = !state.simulatedSunHeat;
    if (state.simulatedSunHeat) {
      state.temperature = Math.min(48, state.temperature + 8);
      state.light = Math.min(1200, state.light + 450);
      logActivity('☀️ Simulated Intense Sun/Heat Wave');
    } else {
      state.temperature = state.currentPlant.idealTempMax;
      state.light = 650;
    }
    sliderTemp.value = state.temperature;
    simTempVal.textContent = state.temperature + '°C';
    sliderLight.value = state.light;
    simLightVal.textContent = state.light + ' Lux';
    syncWithServer();
    updateUI();
  });

  // Action Buttons
  btnWaterPlant.addEventListener('click', () => {
    triggerWateringAction();
  });

  toggleAutoPump.addEventListener('change', (e) => {
    state.autoPump = e.target.checked;
    pumpModeLabel.textContent = state.autoPump ? 'Smart Automated' : 'Manual Control';
    logActivity(`Pump mode changed: ${state.autoPump ? 'Automated' : 'Manual'}`);
    evaluateAutomatedPump();
    updateUI();
  });

  // AI Tabs & Chat
  tabAdvice.addEventListener('click', () => {
    tabAdvice.classList.add('active');
    tabSpeciesGuide.classList.remove('active');
    renderAiContent('insights');
  });

  tabSpeciesGuide.addEventListener('click', () => {
    tabSpeciesGuide.classList.add('active');
    tabAdvice.classList.remove('active');
    renderAiContent('guide');
  });

  btnSendAiChat.addEventListener('click', handleAiQuery);
  aiChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAiQuery();
  });

  btnClearLog.addEventListener('click', () => {
    activityLogList.innerHTML = '';
  });
}

/* ========================================== */
/* 4. RAIN & AUTOMATED PUMP LOGIC            */
/* ========================================== */
function setRainState(isRaining) {
  state.rainDetected = isRaining;
  simToggleRain.checked = isRaining;

  if (isRaining) {
    state.preventedEvents++;
    preventedEventsVal.textContent = state.preventedEvents;
    // Auto-pause pump during rain
    if (state.pumpRunning) {
      state.pumpRunning = false;
    }
    logActivity('🌧️ Rain Sensor Triggered! Auto-irrigation paused.');
  } else {
    logActivity('☀️ Rain Stopped. Sensor clear.');
  }

  evaluateAutomatedPump();
  syncWithServer();
  updateUI();
}

function triggerWateringAction() {
  state.pumpRunning = true;
  updateUI();

  // Create Water Drop Particles for Canvas
  for (let i = 0; i < 40; i++) {
    waterParticles.push({
      x: canvas.width / 2 + (Math.random() * 140 - 70),
      y: 80 + Math.random() * 50,
      vy: 4 + Math.random() * 4,
      radius: 2 + Math.random() * 2
    });
  }

  setTimeout(() => {
    state.soilMoisture = Math.min(100, state.soilMoisture + 15);
    sliderMoisture.value = state.soilMoisture;
    simMoistureVal.textContent = state.soilMoisture + '%';
    state.litersSaved = (parseFloat(state.litersSaved) + 0.5).toFixed(1);
    litersSavedVal.textContent = `${state.litersSaved} L`;
    state.pumpRunning = false;
    logActivity(`🚿 Water Pump Activated (+15% Soil Moisture)`);
    evaluateAutomatedPump();
    syncWithServer();
    updateUI();
  }, 1800);
}

function evaluateAutomatedPump() {
  const p = state.currentPlant;

  if (state.rainDetected) {
    state.pumpRunning = false;
    return;
  }

  if (state.autoPump) {
    if (state.soilMoisture < p.idealMoistureMin && !state.pumpRunning) {
      logActivity(`🤖 Auto-Pump triggered: Soil moisture below ${p.idealMoistureMin}%`);
      triggerWateringAction();
    }
  }
}

/* ========================================== */
/* 5. UI UPDATES & HEALTH EVALUATION         */
/* ========================================== */
function updateUI() {
  const plant = state.currentPlant;

  // Header Nav
  navPlantEmoji.textContent = plant.emoji;
  navPlantName.textContent = plant.name + ' Plant';

  // Alerts Visibilty
  if (state.rainDetected) {
    rainAlertBanner.classList.remove('hidden');
  } else {
    rainAlertBanner.classList.add('hidden');
  }

  if (state.soilMoisture < plant.idealMoistureMin && !state.rainDetected) {
    moistureAlertBanner.classList.remove('hidden');
    document.getElementById('alertMinMoisture').textContent = plant.idealMoistureMin + '%';
  } else {
    moistureAlertBanner.classList.add('hidden');
  }

  // Sensor Cards
  valMoisture.textContent = state.soilMoisture + '%';
  barMoisture.style.width = state.soilMoisture + '%';
  targetMoistureRange.textContent = `${plant.idealMoistureMin}% - ${plant.idealMoistureMax}%`;

  if (state.soilMoisture < plant.idealMoistureMin) {
    statusMoisture.className = 'status-indicator warning';
    statusMoisture.textContent = 'Low Moisture';
  } else if (state.soilMoisture > plant.idealMoistureMax) {
    statusMoisture.className = 'status-indicator warning';
    statusMoisture.textContent = 'High Moisture';
  } else {
    statusMoisture.className = 'status-indicator optimal';
    statusMoisture.textContent = 'Optimal';
  }

  valTemp.textContent = state.temperature + '°C';
  barTemp.style.width = Math.min(100, (state.temperature / 50) * 100) + '%';
  targetTempRange.textContent = `${plant.idealTempMin}°C - ${plant.idealTempMax}°C`;

  if (state.temperature < plant.idealTempMin || state.temperature > plant.idealTempMax) {
    statusTemp.className = 'status-indicator warning';
    statusTemp.textContent = state.temperature > plant.idealTempMax ? 'Extreme Heat' : 'Cold';
  } else {
    statusTemp.className = 'status-indicator optimal';
    statusTemp.textContent = 'Optimal';
  }

  valHumidity.textContent = state.humidity + '%';
  barHumidity.style.width = state.humidity + '%';

  valLight.textContent = state.light + ' Lux';
  barLight.style.width = Math.min(100, (state.light / 1200) * 100) + '%';

  // Rain Sensor Status
  valRain.textContent = state.rainDetected ? 'Raining' : 'Clear';
  if (state.rainDetected) {
    dropAnimBox.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy" style="color:#60a5fa"></i> <span style="color:#60a5fa">Rain Drops Active</span>';
    statusRain.className = 'status-indicator warning';
    statusRain.textContent = 'Rain Active';
  } else {
    dropAnimBox.innerHTML = '<i class="fa-solid fa-cloud-sun"></i> <span>No Rain Detected</span>';
    statusRain.className = 'status-indicator optimal';
    statusRain.textContent = 'Dry Sensor';
  }

  // Pump Status Badge
  if (state.pumpRunning) {
    pumpStateBadge.className = 'pump-state active';
    pumpStateText.textContent = 'Pumping Water...';
  } else {
    pumpStateBadge.className = 'pump-state';
    pumpStateText.textContent = 'Pump Idle';
  }

  // Health Calculation
  calculateHealthScore();

  // Canvas Displays Overlay
  document.getElementById('envTempDisplay').textContent = state.temperature + '°C';
  document.getElementById('envMoistureDisplay').textContent = state.soilMoisture + '%';
  document.getElementById('envLightDisplay').textContent = state.light + ' Lux';

  // Push Telemetry Chart Data
  pushTelemetryData();
}

function calculateHealthScore() {
  const p = state.currentPlant;
  let score = 100;

  // Moisture penalty
  if (state.soilMoisture < p.idealMoistureMin) {
    score -= (p.idealMoistureMin - state.soilMoisture) * 1.5;
  } else if (state.soilMoisture > p.idealMoistureMax) {
    score -= (state.soilMoisture - p.idealMoistureMax) * 1.2;
  }

  // Temp penalty
  if (state.temperature > p.idealTempMax) {
    score -= (state.temperature - p.idealTempMax) * 2;
  } else if (state.temperature < p.idealTempMin) {
    score -= (p.idealTempMin - state.temperature) * 1.8;
  }

  state.healthScore = Math.max(10, Math.min(100, Math.round(score)));
  healthScoreChip.innerHTML = `<i class="fa-solid fa-heart-pulse"></i> Health: ${state.healthScore}%`;

  if (state.healthScore > 80) {
    navPlantStatusChip.className = 'plant-status-chip optimal';
    navPlantStatusChip.innerHTML = '<i class="fa-solid fa-circle-check"></i> Ideal Condition';
  } else {
    navPlantStatusChip.className = 'plant-status-chip warning';
    navPlantStatusChip.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Needs Care';
  }
}

/* ========================================== */
/* 6. TELEMETRY CHART.JS                     */
/* ========================================== */
function initChart() {
  const ctxChart = document.getElementById('telemetryChart').getContext('2d');
  telemetryChart = new Chart(ctxChart, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Soil Moisture (%)',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Temperature (°C)',
          data: [],
          borderColor: '#ef4444',
          tension: 0.4,
          borderDash: [5, 5]
        },
        {
          label: 'Humidity (%)',
          data: [],
          borderColor: '#10b981',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' }, min: 0, max: 100 }
      }
    }
  });

  // Pre-fill initial points
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const timeStr = new Date(now.getTime() - i * 4000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    telemetryChart.data.labels.push(timeStr);
    telemetryChart.data.datasets[0].data.push(state.soilMoisture);
    telemetryChart.data.datasets[1].data.push(state.temperature);
    telemetryChart.data.datasets[2].data.push(state.humidity);
  }
  telemetryChart.update();
}

function pushTelemetryData() {
  if (!telemetryChart) return;
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  telemetryChart.data.labels.push(timeStr);
  telemetryChart.data.datasets[0].data.push(state.soilMoisture);
  telemetryChart.data.datasets[1].data.push(state.temperature);
  telemetryChart.data.datasets[2].data.push(state.humidity);

  if (telemetryChart.data.labels.length > 12) {
    telemetryChart.data.labels.shift();
    telemetryChart.data.datasets.forEach(ds => ds.data.shift());
  }
  telemetryChart.update('none');
}

/* ========================================== */
/* 7. VIRTUAL PLANT CANVAS ENGINE             */
/* ========================================== */
function startCanvasAnimation() {
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Sky Background
    drawSky();

    // 2. Draw Sun or Heat Ray Flares
    drawSunAndSkyElements();

    // 3. Draw Pot & Soil Level
    drawPotAndSoil();

    // 4. Draw Living Animated Plant
    drawLivingPlant();

    // 5. Render Rain Effect
    if (state.rainDetected) {
      drawRainParticles();
    }

    // 6. Render Pump Water Drop Particles
    drawWaterActionParticles();

    animFrameId = requestAnimationFrame(draw);
  }

  draw();
}

function drawSky() {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  if (state.isNight) {
    grad.addColorStop(0, '#050a15');
    grad.addColorStop(1, '#0f172a');
  } else {
    grad.addColorStop(0, '#0d1d3a');
    grad.addColorStop(0.6, '#152b52');
    grad.addColorStop(1, '#1b3866');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSunAndSkyElements() {
  // Sun Ray flare
  ctx.save();
  ctx.beginPath();
  const sunGrad = ctx.createRadialGradient(700, 60, 10, 700, 60, 120);
  sunGrad.addColorStop(0, 'rgba(255, 165, 2, 0.6)');
  sunGrad.addColorStop(0.5, 'rgba(255, 165, 2, 0.15)');
  sunGrad.addColorStop(1, 'rgba(255, 165, 2, 0)');
  ctx.fillStyle = sunGrad;
  ctx.arc(700, 60, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPotAndSoil() {
  const centerX = canvas.width / 2;
  const potY = canvas.height - 110;

  // Soil Base Glow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(centerX, potY + 10, 170, 25, 0, 0, Math.PI * 2);
  const soilColor = state.soilMoisture > 75 ? '#1a0f07' : state.soilMoisture < 40 ? '#5c4530' : '#382515';
  ctx.fillStyle = soilColor;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.stroke();

  // Terracotta / Ceramic Pot
  ctx.beginPath();
  ctx.moveTo(centerX - 130, potY + 10);
  ctx.lineTo(centerX + 130, potY + 10);
  ctx.lineTo(centerX + 90, potY + 110);
  ctx.lineTo(centerX - 90, potY + 110);
  ctx.closePath();

  const potGrad = ctx.createLinearGradient(centerX - 130, 0, centerX + 130, 0);
  potGrad.addColorStop(0, '#c06c84');
  potGrad.addColorStop(0.5, '#6c5ce7');
  potGrad.addColorStop(1, '#355c7d');
  ctx.fillStyle = potGrad;
  ctx.fill();
  ctx.restore();
}

function drawLivingPlant() {
  const centerX = canvas.width / 2;
  const potY = canvas.height - 110;
  const p = state.currentPlant;

  windAngle += 0.02;
  const sway = Math.sin(windAngle) * (state.soilMoisture < 35 ? 1.5 : 4);

  // Determine foliage health color
  let leafColor = p.color;
  if (state.soilMoisture < 35) leafColor = '#d6a20a'; // withered yellow
  if (state.temperature > 38) leafColor = '#e74c3c'; // heat burnt

  ctx.save();
  ctx.translate(centerX, potY + 5);

  // Main Stem
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-15 + sway, -80, 15 + sway, -160, sway * 1.5, -230);
  ctx.lineWidth = 10;
  ctx.strokeStyle = leafColor;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Side Branches & Leaves
  const drawLeaf = (x, y, scale, angle) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -20 * scale, 12 * scale, 25 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = leafColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.stroke();
    ctx.restore();
  };

  drawLeaf(-5 + sway * 0.4, -70, 1.2, -0.6 + sway * 0.02);
  drawLeaf(5 + sway * 0.6, -110, 1.3, 0.6 + sway * 0.02);
  drawLeaf(-10 + sway * 0.8, -160, 1.1, -0.7 + sway * 0.02);
  drawLeaf(8 + sway, -200, 1.0, 0.5 + sway * 0.02);

  // Top Fruit / Flower Avatar
  ctx.font = '42px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(p.emoji, sway * 1.5, -245);

  ctx.restore();
}

function drawRainParticles() {
  if (rainParticles.length < 50) {
    rainParticles.push({
      x: Math.random() * canvas.width,
      y: 0,
      length: 12 + Math.random() * 10,
      vy: 8 + Math.random() * 6
    });
  }

  ctx.save();
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  for (let i = 0; i < rainParticles.length; i++) {
    const p = rainParticles[i];
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - 2, p.y + p.length);
    p.y += p.vy;

    if (p.y > canvas.height) {
      p.y = 0;
      p.x = Math.random() * canvas.width;
    }
  }
  ctx.stroke();
  ctx.restore();
}

function drawWaterActionParticles() {
  ctx.save();
  ctx.fillStyle = '#60a5fa';

  for (let i = waterParticles.length - 1; i >= 0; i--) {
    const p = waterParticles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();

    p.y += p.vy;
    if (p.y > canvas.height - 120) {
      waterParticles.splice(i, 1);
    }
  }
  ctx.restore();
}

/* ========================================== */
/* 8. AI ASSISTANT & SPECIES GUIDE LOGIC     */
/* ========================================== */
function renderAiContent(type) {
  const p = state.currentPlant;

  if (type === 'insights') {
    let advice = `Your <strong>${p.name}</strong> is currently at ${state.healthScore}% health. `;
    if (state.soilMoisture < p.idealMoistureMin) {
      advice += `Soil moisture is low (${state.soilMoisture}%). We recommend running the water pump.`;
    } else if (state.temperature > p.idealTempMax) {
      advice += `Air temperature (${state.temperature}°C) is above ideal range (${p.idealTempMin}-${p.idealTempMax}°C). Consider shade.`;
    } else {
      advice += `All micro-climate conditions are optimal! Keep up the smart automated schedule.`;
    }

    aiContentBox.innerHTML = `
      <div class="ai-insight-item">
        <i class="fa-solid fa-brain icon-info"></i>
        <p>${advice}</p>
      </div>
    `;
  } else {
    aiContentBox.innerHTML = `
      <div style="font-size:0.8rem; line-height:1.5;">
        <p><strong>Soil Type:</strong> ${p.soilType}</p>
        <p><strong>Sunlight:</strong> ${p.sunlight}</p>
        <p><strong>Care Note:</strong> ${p.careTips}</p>
      </div>
    `;
  }
}

function handleAiQuery() {
  const query = aiChatInput.value.trim();
  if (!query) return;

  const p = state.currentPlant;
  aiContentBox.innerHTML = `
    <div class="ai-insight-item">
      <i class="fa-solid fa-robot"></i>
      <p><strong>Q:</strong> ${query}<br><strong>A:</strong> For ${p.name}, maintain soil moisture around ${p.idealMoistureMin}-${p.idealMoistureMax}%. ${p.careTips}</p>
    </div>
  `;
  aiChatInput.value = '';
}

/* ========================================== */
/* 9. ACTIVITY LOGGER                         */
/* ========================================== */
function logActivity(text) {
  const li = document.createElement('li');
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  li.innerHTML = `<span class="log-time">${time}</span> ${text}`;
  activityLogList.prepend(li);
}
