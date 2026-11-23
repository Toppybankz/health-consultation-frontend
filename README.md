# Health Consultation Frontend

React frontend for the Health Consultation platform.

## Setup
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL`.
3. Start the development server with `npm start`.

## Account workflow
Patients can register and sign in. Doctor registrations remain pending until an administrator approves them. Approved doctors appear in the patient-facing doctor directory.

Administrators are provisioned separately from public registration using the backend `npm run create-admin` script. After signing in through `/login`, an administrator is redirected to `/admin`, where they can review doctor applications and manage account status.

## Messaging
The chat page includes a private conversation inbox showing each participant and their latest message. Select an existing conversation to load its history, or choose an approved doctor/patient from the directory to start a conversation. The backend enforces participant-only access.

## Routes
- `/` Home
- `/login` Login
- `/register` Registration
- `/chat` Private chat and conversation inbox
- `/admin` Administrator dashboard (admin role only)

The administrator interface is protected by a role check in the UI and administrator authorization on the backend API.
