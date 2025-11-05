# Finance Dashboard

A responsive Angular 17 dashboard that visualizes currency exchange data from the Narodowy Bank Polski (NBP) public API. The app lists the latest FX rates (Table A), supports quick filtering, and renders interactive historical trends using Chart.js via `ng2-charts`.

## Features

- **Live FX table** sourced from `GET /exchangerates/tables/A` with inline filtering and selection.
- **Historical trends** powered by `GET /exchangerates/rates/A/{code}/{start}/{end}` and rendered with Chart.js.
- **Signal-driven state** for table data, selected instruments, date range, filters, and chart series.
- **Responsive dark UI** composed with SCSS, CSS Grid, and a reusable card wrapper.
- **Fetch-backed HttpClient** via Angular's `withFetch()` configuration.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development server

```bash
npm start
```

The app will be available at `http://localhost:4200/`. Angular's live reload is enabled by default.

### Production build

```bash
npm run build
```

Compiled assets will be generated in `dist/finance-dashboard`.

## Project Structure

```
src/
├── app/
│   ├── app.component.ts              # Standalone root with router outlet
│   ├── app.config.ts                 # Global providers (router, HttpClient with fetch, animations)
│   ├── app.routes.ts                 # Single dashboard route
│   ├── core/
│   │   ├── models/                   # API-facing and view models
│   │   └── services/nbp.service.ts   # NBP API integration
│   ├── features/dashboard/           # Dashboard page and feature components
│   └── shared/ui/card/               # Reusable card shell component
└── styles.scss                       # Global dark theme styles
```

## State & Data Flow Talking Points

- Angular **signals** drive the core UI state: latest rates, filtering term, selected currency code, active date range, chart series, loading flags, and error messages.
- A computed signal filters the rate table client-side, and another resolves the currently selected currency metadata for chart labeling.
- A signal-backed `effect` reacts to selection, date, and manual refresh changes to orchestrate historical data loading.
- `NbpService` centralizes HTTP access, returning typed DTOs that the dashboard consumes via `firstValueFrom` for concise async/await workflows.

## UI & UX Talking Points

- The layout uses CSS Grid to present the table and chart side-by-side, collapsing into a vertical flow below ~900 px for smaller screens.
- A reusable `<ui-card>` shell provides consistent elevation, padding, and dark theme styling across panels.
- Controls combine filtering, currency selection, date pickers, and a refresh action with optimistic disabling while requests are in-flight.
- Chart styling embraces the dark palette, with legible tooltip and axis colors tailored for low-light environments.

## API Notes

- All requests target `https://api.nbp.pl/api` using Angular's Fetch-powered `HttpClient`.
- Historical queries default to the previous 30 days and can be adjusted via native `<input type="date">` controls.
- The app logs network failures to the console and surfaces user-friendly fallback copy in the table and chart areas.

## Testing

This project ships with the standard Angular testing harness (Karma + Jasmine). To execute unit tests:

```bash
npm test
```

## Interview Highlights

- Demonstrates modern Angular 17 patterns: standalone components, signals, typed providers, and `withFetch()` HTTP configuration.
- Showcases modular architecture separating core services, feature composition, and shared UI building blocks.
- Illustrates pragmatic responsiveness, dark theme design, and Chart.js integration for financial data storytelling.
- Provides clear documentation and developer ergonomics to accelerate onboarding and discussion.
