# Health Consultation Platform — Frontend

A React web client for a health-consultation application. The interface includes a home page, patient/doctor registration and login, and a private chat screen.

## Technology
- React 18 and React Router
- Axios for REST API requests
- Socket.IO client for real-time message updates
- Tailwind CSS

## Run locally
1. Install Node.js (version 16 or later) and npm.
2. Clone this repository and run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set the API and Socket.IO URLs to the backend you are running.
5. Run `npm start` and open http://localhost:3000.

## Environment variables
- `REACT_APP_API_URL`: backend REST base URL, including the `/api` prefix (for example, `http://localhost:5001/api`).
- `REACT_APP_SOCKET_URL`: backend Socket.IO origin (for example, `http://localhost:5001`).

These are public frontend configuration values, not secrets. Never put private keys, database credentials, or JWT signing secrets in a React environment variable; frontend values are embedded in the browser bundle.

## Available scripts
- `npm start` — development server
- `npm test` — test runner
- `npm run build` — production build

## Main application areas
- `src/pages` — home, registration, login, chat and dashboard pages
- `src/services/api.js` — REST API client
- `src/components` — shared navigation and footer components

## Important security note
The backend requires a valid bearer token for protected user and chat endpoints. Register and log in before opening the chat. Do not commit local `.env` files.
