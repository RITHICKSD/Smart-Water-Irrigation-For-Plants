# Project Structure

## Classification

Full-stack demonstration: a React/Vite browser dashboard, an Express/HTTP/WebSocket server, and an ESP32 Arduino sketch simulated with Wokwi.

## Entry points

- Browser build: root `index.html` loads `src/main.jsx`, which mounts `src/App.jsx`.
- Server: `server/index.js`; `npm run server` and `npm start` run it on `PORT` or port 3000.
- Device: `wokwi/sketch.ino` uses Arduino `setup()` and `loop()`; `wokwi/diagram.json` describes the simulated board and wiring.
- Alternate fallback page: `public/index.html` is a separate inline React/Babel page. Express serves `dist` before `public`.

## Layers and file counts

Counts are source files found in the project folders, excluding `node_modules` and generated output.

| Area | Files | Role |
|---|---:|---|
| `src/` | 14 | Browser UI: 12 JSX files, one plant-data JS file, and one stylesheet |
| `server/` | 1 | Express API, WebSocket server, in-memory telemetry state, static hosting |
| `public/` | 3 | Alternate inline UI, stylesheet, and a standalone `app.js` file |
| `wokwi/` | 2 | ESP32 firmware and Wokwi circuit definition |

The React UI is organized as a single page with reusable presentation components, but `App.jsx` owns telemetry, pump simulation, history, and navigation state. There is no router, service/repository layer, database, or persistence layer.

## Functional areas

- Sensor monitoring: moisture, temperature, humidity, light, rain, water-level cards.
- Irrigation simulation: auto/manual mode; automatic watering starts below 40% and simulates moisture increasing to a target capped at 60%; includes rain interlock and tank refill.
- Plant visualization: animated canvas and status banners.
- Analytics and academic reporting: charts, water-saving estimates, print view.
- IoT ingestion: REST endpoints and WebSocket broadcasts.
- ESP32 hardware simulation: DHT, analog sensors, rain switch, relay, LED, buzzer, LCD.

## Notable structure issues

- `public/index.html` is an alternate app implementation; `public/app.js` is not referenced by that HTML, and `public/styles.css` is not linked there.
- `src/components/SensorSimulator.jsx` is imported by `App.jsx` but not rendered.
- The React dashboard's plant data currently contains only Tomato. The legacy page has a separate plant list and behavior.
- `server/index.js` stores telemetry only in process memory; values reset when the server restarts.
