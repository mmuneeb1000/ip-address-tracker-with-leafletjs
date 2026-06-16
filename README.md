# IP Address Tracker (Leaflet + Vite)

A browser-based IP tracking application that resolves the user’s current IP and any searched IP address, then visualizes the geolocation on an interactive Leaflet map. Built with Vite for fast bundling and a custom backend API for IP resolution.

## Development Process and Steps Taken

### 1. Project Initialization

- Created a Vite-based frontend project using vanilla JavaScript
- Structured the project into modular folders under `src/`
- Installed Leaflet.js for map rendering and interaction

### 2. UI and Map Setup

- Initialized a Leaflet map centered on a default fallback location
- Disabled default zoom controls for custom UI handling
- Integrated CartoDB tile layer for map rendering
- Configured responsive behavior for mobile and desktop layouts

### 3. Marker Configuration

- Replaced default Leaflet marker icon handling
- Implemented a custom marker
- Styled marker via inline HTML and CSS adjustments
- Fixed asset loading issues by correcting image paths for production builds

### 4. Backend Integration

- Install express, cors, axios, dotenv
- Built a backend API endpoint `/api/ip-tracker`
- Implemented IP detection using request headers (`x-forwarded-for`)
- Added support for optional query-based IP lookup
- Connected geolocation service to resolve IP into:
  - Latitude and longitude
  - City, region, country
  - ISP and timezone

### 5. Frontend API Handling

- Created `fetchIPData()` to handle API requests
- Supported two modes:
  - Auto-detect current user IP on page load
  - Manual IP search via input form
- Implemented error handling for failed requests

### 6. UI State Management

- Built `updateUI()` to render IP details dynamically
- Ensured safe fallback values for missing API fields
- Updated DOM elements for:
  - IP address
  - Location
  - Timezone
  - ISP

### 7. Map Synchronization

- Developed `updateMapView()` to sync map with API response
- Dynamically adjusted zoom based on screen size
- Offset map centering on mobile for better marker visibility
- Ensured marker replacement on each update

### 8. Asset Handling Fixes

- Fixed Vite production asset resolution issues
- Replaced `/src/...` static paths with Vite-compatible imports or public assets
- Ensured marker icons load correctly on Netlify after build

### 9. Deployment Configuration

- Configured Netlify deployment with `dist` as publish directory
- Added build command `npm run build`
- Verified production build output structure
- Hosted backend separately and connected via environment variable:
  - `VITE_API_URL`

### 10. Final Optimization

- Cleaned redundant API logic from frontend
- Ensured backend handles all IP resolution logic
- Verified responsive behavior across devices
- Stabilized map rendering and marker updates

## Tech Stack

- Vite (frontend tooling)
- Vanilla JavaScript (ES modules)
- Leaflet.js (mapping library)
- Node.js + Express (backend)
- dotenv (environment configuration)
- cors (cross-origin access)

## Deployment

- Frontend: [Netlify](https://stunning-toffee-e1de3d.netlify.app/)
- Backend: Render or equivalent Node hosting

## Key Learning Outcomes

- Proper separation of frontend and backend responsibilities
- Asset handling differences between dev and production in Vite
- IP geolocation via request-based detection
- Map synchronization with asynchronous API data
- Deployment pipeline issues in static hosting environments

## Note

IPIFY API is left exposed for simplicity.
