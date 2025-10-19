# Task Manager

A full-stack task management app with a Node/Express + MongoDB backend and a React (Vite) + Tailwind frontend. Features task CRUD with validation and sanitization, action logs, and Basic Auth-protected APIs.

## Monorepo Structure
- **`backend/`**: Express server, MongoDB via Mongoose, Basic Auth middleware, REST APIs
- **`frontend/`**: React app (Vite), TailwindCSS, React Router, axios

## Tech Stack
- **Backend**: Node.js, Express, Mongoose, express-validator, sanitize-html, helmet, cors, dotenv
- **Frontend**: React 19, Vite, TailwindCSS, React Router, axios
- **Database**: MongoDB Atlas or local MongoDB

## Prerequisites
- Node.js 18+
- npm 9+
- MongoDB instance (Atlas or local)

## Environment Variables
Create the following files before running locally. Do NOT commit real secrets.

- **`backend/.env`**
```
# Server
PORT=4000

# Mongo
MONGODB_URI=mongodb://localhost:27017/task_manager

# Basic Auth (used for all /api/* routes)
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=change_me
```

- **`frontend/.env`**
```
# Base URL for backend API
VITE_API_BASE=http://localhost:4000
```

## Installation
Run installs in both packages.

- **Backend** (`backend/`):
```
npm install
```
- **Frontend** (`frontend/`):
```
npm install
```

## Running Locally
Open two terminals:

- **Backend** (`backend/`):
```
# Dev mode with nodemon
npm run dev
# or start
npm start
```
The backend will listen on `http://localhost:4000`.

- **Frontend** (`frontend/`):
```
npm run dev
```
The frontend will start on Vite's default port (typically `http://localhost:5173`). It uses `VITE_API_BASE` to reach the backend.

## Build
- **Frontend** (`frontend/`):
```
npm run build
npm run preview   # optional local preview
```

## API Overview
All API routes require Basic Auth and are mounted under `/api`. Include an `Authorization: Basic <base64(user:pass)>` header. Example using curl:
```
# user: admin, pass: change_me
curl -u admin:change_me http://localhost:4000/api/tasks
```

### Tasks
- **GET** `/api/tasks`
  - Query: `page` (number, default 1), `limit` (number, default 5), `q` (string search on title/description)
  - Response: `{ data, page, limit, totalPages, total }`

- **POST** `/api/tasks`
  - Body: `{ title: string[1..100], description: string[1..500] }`
  - Validates and sanitizes HTML; creates a task and a log entry.
  - Response: `{ data: Task }`

- **PUT** `/api/tasks/:id`
  - Body: `{ title?: string[1..100], description?: string[1..500] }`
  - Only changed fields are persisted and logged.
  - Errors: `400 No changes provided` if no effective updates.
  - Response: `{ data: Task }`

- **DELETE** `/api/tasks/:id`
  - Deletes the task and creates a log entry.
  - Response: `{ message: 'Task deleted' }`

### Logs
- **GET** `/api/logs`
  - Query: `page` (default 1), `limit` (default 20)
  - Response: `{ data, page, limit, totalPages, total }`

### Error Shape
Errors are returned as JSON.
```
{ "error": string }              # for generic errors
{ "errors": [{ msg, param, ... }]}  # for validation errors
```

## Security Notes
- All `/api/*` routes are protected by Basic Auth (`backend/middleware/basicAuth.js`).
- Inputs are validated with `express-validator` and sanitized with `sanitize-html`.
- Helmet is enabled; CORS is allowed (tweak as needed).
- Never commit real credentials or connection strings. Use example `.env` values above.

## Frontend Notes
- Router paths: `/` (Tasks), `/logs` (Logs). See `frontend/src/App.jsx`.
- Configure API base via `frontend/.env` (`VITE_API_BASE`).
- Ensure the backend is running and reachable from the browser origin.

## Scripts
- **Backend** (`backend/package.json`):
  - `npm run dev` → `nodemon server.js`
  - `npm start` → `node server.js`
- **Frontend** (`frontend/package.json`):
  - `npm run dev` → Vite dev server
  - `npm run build` → Build production assets
  - `npm run preview` → Preview built app

## Project Files of Interest
- `backend/server.js` – Express app, MongoDB connection, route mounting
- `backend/routes/tasks.js` – Task CRUD APIs with validation/sanitization and logging
- `backend/routes/logs.js` – Paginated logs API
- `backend/models/Task.js`, `backend/models/Log.js` – Mongoose models
- `backend/middleware/basicAuth.js` – Basic Auth guard for `/api`
- `frontend/src/App.jsx` – Routes and page composition

## Troubleshooting
- If MongoDB connection fails, verify `MONGODB_URI` and network access.
- If the frontend can’t reach the backend, verify `VITE_API_BASE` and CORS settings.
- For auth errors, confirm Basic Auth credentials in both request and backend `.env`.
