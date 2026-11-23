# Health Consultation Frontend

A React web application for a health consultation platform. It demonstrates patient and doctor account flows, administrator account management, and private real-time messaging.

**Backend:** [Health Consultation Backend](https://github.com/Toppybankz/health-backend)

## Features

- Patient and doctor registration and login
- Doctor applications remain pending until an administrator approves them
- Role-aware navigation and an administrator dashboard
- Administrator review of doctor applications and account status management
- Private chat inbox with conversation history and real-time message updates
- Authenticated API requests and Socket.IO connections
- Responsive landing page and direct-route fallback for deployment

## Technology

- React 18 and React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- Create React App (react-scripts)

## Run locally

1. Install Node.js 20 or later.
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a local environment file:

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

The frontend is available at http://localhost:3000. The backend and MongoDB must also be running for authentication, account management, and messaging.

## Main routes

| Route | Description |
| --- | --- |
| `/` | Project landing page |
| `/login` | Sign in |
| `/register` | Patient or doctor registration |
| `/chat` | Private conversations |
| `/admin` | Administrator dashboard |

The administrator route is role-checked in the frontend. Authorization is also enforced by the backend; frontend route checks alone are not a security boundary.

## Deploy to Vercel

A [vercel.json](./vercel.json) file provides a single-page-app fallback so direct visits and refreshes on routes such as `/login`, `/chat`, and `/admin` resolve to the React application.

1. Import this GitHub repository into Vercel.
2. Select **Create React App** (or allow Vercel to detect it).
3. Use `npm run build` as the build command and `build` as the output directory.
4. Add these environment variables to the Vercel project for the Production environment:

   | Name | Value |
   | --- | --- |
   | `REACT_APP_API_URL` | `https://YOUR-BACKEND-HOST/api` |
   | `REACT_APP_SOCKET_URL` | `https://YOUR-BACKEND-HOST` |

5. Redeploy after setting the variables. React environment variables are embedded at build time.
6. Add the exact Vercel site origin to the backend's `FRONTEND_URL` environment variable. Do not include a trailing slash.

The frontend cannot provide login, registration, administration, or messaging until it is configured to reach a deployed backend with a working database.

## Quality checks

```bash
npm run build
npm test
```

GitHub Actions runs the production build on pushes and pull requests. A successful build confirms compilation; it does not prove every user journey works against the live backend.

## Related services

- [Backend source and API documentation](https://github.com/Toppybankz/health-backend)
- [Backend deployment blueprint](https://github.com/Toppybankz/health-backend/blob/main/render.yaml)

## Project status and responsible use

This is a portfolio demonstration. Use synthetic accounts and data only. It is not a certified clinical system and must not be used for real patient information, diagnosis, treatment, or emergency care without appropriate independent privacy, security, accessibility, clinical-safety, and regulatory review.

Screenshots should be added only after capturing the genuine running application. Do not present mockups or fictional testimonials as real user evidence.
