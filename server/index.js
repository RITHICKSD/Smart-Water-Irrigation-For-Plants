import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());
// Accept requests from Wokwi ESP32 via ngrok tunnel
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../public')));

let sensorState = {
  plant: 'Tomato',
  soilMoisture: 55,
  temperature: 27,
  humidity: 60,
  light: 600,
  rainDetected: false,
  timestamp: 0
};
const rainHistory = [];

function broadcast(payload) {
  const msg = JSON.stringify(payload);
  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  });
}

app.post('/api/sensors', (req, res) => {
  const d = req.body;
  if (d.soilMoisture !== undefined) sensorState.soilMoisture = +d.soilMoisture;
  if (d.temperature  !== undefined) sensorState.temperature  = +d.temperature;
  if (d.humidity     !== undefined) sensorState.humidity     = +d.humidity;
  if (d.light        !== undefined) sensorState.light        = +d.light;
  if (d.rainDetected !== undefined) sensorState.rainDetected = !!d.rainDetected;
  if (d.plant        !== undefined) sensorState.plant        = d.plant;
  sensorState.timestamp = Date.now();

  rainHistory.push(sensorState.rainDetected);
  if (rainHistory.length > 10) rainHistory.shift();

  broadcast({ type: 'sensor_update', data: sensorState, rainHistory });
  console.log(`[WOKWI TELEMETRY UPDATE] T:${sensorState.temperature}°C H:${sensorState.humidity}% SM:${sensorState.soilMoisture}% L:${sensorState.light} Rain:${sensorState.rainDetected}`);
  res.json({ success: true });
});

app.get('/api/sensors', (req, res) => res.json({ data: sensorState, rainHistory }));

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'sensor_update', data: sensorState, rainHistory }));
  ws.on('error', () => {});
});

setInterval(() => broadcast({ type: 'heartbeat', data: sensorState, rainHistory }), 5000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🌱 Plant Environment Server is RUNNING at → http://localhost:${PORT}\n`);
});
