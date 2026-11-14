# Architecture Index

## Analysis scope

This records the current implementation as found. No migration target or rewrite scope was specified, so no migration boundary is declared. `public/index.html` is a separately reachable fallback implementation; `public/app.js` is not referenced by it.

## Implementation Guide

This index is not the full contract. Do not implement from this file alone; follow the artifact paths below.

### Global artifacts

- `unit_graph.yaml`
  - Who reads: all workers.
  - Use for: current unit boundaries, entry points, dependencies, and source anchors.
  - How to consume: select the assigned unit; do not treat source anchors as a rewrite list.
- `wire_contracts.yaml`
  - Who reads: workers touching HTTP or WebSocket interfaces.
  - Use for: current request/response and frame shapes.
  - How to consume: filter by the assigned unit. Contracts describe the current interface because no target technology was supplied.
- `shared_modules.yaml`
  - Who reads: all workers.
  - Use for: shared code used by multiple units.
  - How to consume: filter `used_by_units`; currently no cross-unit source module was identified.
- `cross_unit_state.yaml`
  - Who reads: workers touching telemetry state.
  - Use for: in-memory server state and the pages that read it.
  - How to consume: filter flows where writer or reader unit matches the assignment.
- `project-structure.md` and `tech-stack.md`
  - Who reads: all workers.
  - Use for: project layers, entry points, functional areas, dependencies, and runtime constraints.

### Unit: `dashboard-page`

- External trigger: browser navigation to `/`; landing page launches the dashboard.
- Must read:
  - `units/dashboard-page/behavior.yaml` — telemetry freshness, alerts, history, and irrigation behavior.
  - `units/dashboard-page/bindings.yaml` — root mount and HTTP/WebSocket configuration.
  - `units/dashboard-page/unit_decomposition.yaml` — advisory split candidates only (`commit: false`).
- Relevant global rows: `wire_contracts.yaml` for `sensor-api`; `cross_unit_state.yaml` flows where `dashboard-page` is the reader.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/test/runtime evidence.

### Unit: `legacy-public-page`

- External trigger: fallback page served from `public/index.html` when the `dist` static root does not supply the page.
- Must read:
  - `units/legacy-public-page/behavior.yaml` — polling and local pump behavior.
  - `units/legacy-public-page/bindings.yaml` — inline React/Babel bootstrap and relative API path.
  - `units/legacy-public-page/unit_decomposition.yaml` — advisory split candidates only (`commit: false`).
- Relevant global rows: `wire_contracts.yaml` for `sensor-api`; `cross_unit_state.yaml` flows where `legacy-public-page` is the reader.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/test/runtime evidence.

### Unit: `sensor-api`

- External trigger: HTTP GET/POST `/api/sensors` or a WebSocket connection.
- Must read:
  - `units/sensor-api/behavior.yaml` — state mutation, rain history, broadcasts, and error behavior.
  - `units/sensor-api/bindings.yaml` — routes, WebSocket binding, and `PORT`.
  - `units/sensor-api/unit_decomposition.yaml` — advisory split candidates only (`commit: false`).
- Relevant global rows: all `wire_contracts.yaml` entries for `sensor-api`; `cross_unit_state.yaml` flows written by `sensor-api`.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/test/runtime evidence.

### Unit: `esp32-firmware`

- External trigger: ESP32 startup and recurring sensor/control loop.
- Must read:
  - `units/esp32-firmware/behavior.yaml` — sensor fallbacks, rain safety, pump policy, and telemetry.
  - `units/esp32-firmware/bindings.yaml` — pin assignments, Arduino lifecycle, and hard-coded runtime values.
  - `units/esp32-firmware/unit_decomposition.yaml` — advisory split candidates only (`commit: false`).
- Relevant global rows: `wire_contracts.yaml` telemetry ingestion entry for `sensor-api`; `unit_graph.yaml` dependency on `sensor-api`.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/test/runtime evidence.
