# Health Consultation Frontend

A React application for a health consultation platform, with patient and doctor account flows, administrator account management, and private real-time messaging.

## Features

- Patient and doctor registration and login
- Doctor applications remain pending until an administrator approves them
- Role-aware navigation and an administrator dashboard
- Administrator review of doctor applications and account status management
- Private chat inbox with conversation history and real-time message updates
- Authenticated API requests and Socket.IO connections

## Technology

- React 18
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- Create React App (react-scripts)

## Getting started

1. Install Node.js 20 or later.
2. Clone this repository and install dependencies:

   ```bash
   npm ci
   ```

3. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

4. Set the API and Socket.IO addresses in `.env`:

   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   REACT_APP_SOCKET_URL=http://localhost:5001
   ```

5. Start the development server:

   ```bash
   npm start
   ```

The development app is available at http://localhost:3000. The backend must be running separately for authentication, account management, and messaging.

## Main routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/login` | Sign in |
| `/register` | Patient or doctor registration |
| `/chat` | Private conversations |
| `/admin` | Administrator dashboard |

The administrator route is role-checked in the frontend. Authorization is also enforced by the backend; frontend route checks alone are not a security boundary.

## Related repository

The API and Socket.IO server are maintained in [health-backend](https://github.com/Toppybankz/health-backend).

## Quality checks

Run the production build locally:

```bash
npm run build
```

Run the test runner:

```bash
npm test
```

GitHub Actions runs the production build for pull requests and pushes to the main and fix branches. A successful build confirms compilation, not that every user journey has been tested against a running backend.

## Screenshots

Add genuine screenshots of the running application here when available. Do not use mockups or sample images as evidence of implemented functionality.

## Project status

This is a portfolio project. It does not need to be deployed publicly to be reviewed on GitHub. Do not use it to process real patient information without appropriate privacy, security, accessibility, and regulatory review.
