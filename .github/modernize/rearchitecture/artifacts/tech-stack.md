# Tech Stack

## Browser application

- JavaScript ES modules and JSX; React and ReactDOM `^18.2.0` (lockfile resolves `18.3.1`).
- Vite `^5.0.0` (lockfile resolves `5.4.21`) with `@vitejs/plugin-react` `^4.2.0` (lockfile `4.7.0`).
- `lucide-react` `^0.294.0` for icons.
- CSS is authored in `src/index.css`; no UI component framework is declared.

## Server

- Node.js ES modules (`"type": "module"`); no `engines` declaration pins a Node version.
- Express `^4.18.2` (lockfile `4.22.3`), `cors` `^2.8.5` (lockfile `2.8.6`), and `ws` `^8.14.2` (lockfile `8.22.0`).
- Vite dev server defaults to port 5173 and proxies `/api` to `http://localhost:3000`; Express defaults to port 3000.
- Server state is in-memory; no database, ORM, or persistence dependency is present.

## Device simulation

- ESP32 Arduino C++ sketch under `wokwi/`.
- Includes WiFi, HTTPClient, WiFiClientSecure, DHT, Wire, and LiquidCrystal_I2C headers. Library versions are not pinned in this folder.
- The Wokwi diagram and sketch both configure a DHT11 part; the UI labels the reading DHT11.

## Build and verification configuration

- Scripts: `npm run dev`, `npm run build`, `npm run preview`, `npm run server`, `npm start`.
- `test_api.js` is a manual POST example; there is no test script or declared test framework.
- No TypeScript configuration, linter configuration, Node runtime constraint, or firmware dependency lock is present in the inspected project files.
- The alternate `public/index.html` loads React/ReactDOM and Babel Standalone from unversioned CDN URLs, including a React development build.
- Dependency CVE/EOL status was not assessed as part of this structural analysis.
