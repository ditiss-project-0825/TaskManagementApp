# Task Management Application

This repository contains a simple Task Management Application with a Node/Express backend and a React frontend.

> Quick note: these instructions work on macOS, Linux, and Windows (PowerShell).


## Prerequisites ✅

- Node.js v22.14.0 (or compatible Node 22.x)
- npm (bundled with Node)
- Docker & Docker Compose (optional, for containerized run)


## Run locally (recommended)

### 1) Start the backend

1. Open a terminal and go to the `Backend` folder:

```bash
cd Backend
```

2. Install dependencies and start the server:

```bash
npm install
npm start
```

3. The backend listens on port 8082 by default. Verify the server is up:

```
GET http://localhost:8082/health
```

> Optional `Backend/.env` variables:
> - `SERVER_PORT` (default: `8082`)
> - `FRONTEND_URL` (default: `*`)
> - `SEED_DB` (set to `false` to skip inserting sample tasks)


### 2) Start the frontend

1. Create a `.env` file in the `Frontend` folder and add the backend URL:

```
REACT_APP_BACKEND_URL=http://localhost:8082
```

2. Install dependencies and start the dev server:

```bash
cd Frontend
npm install
npm start
```

3. The React app runs by default on http://localhost:3000


## Run with Docker (optional) 🐳

From the repository root you can build and run both services using Docker Compose:

```bash
docker-compose up --build
```

This will expose the backend on port `8082` and the frontend on port `3000` as configured in `docker-compose.yaml`.


## Tests & scripts

- Backend smoke test:
- Run the following command only after starting the backend server.

```bash
cd Backend
npm run smoke-test
```


---

## Notes

- Start the backend first, then start the frontend (the frontend needs the backend URL to be set).
- To stop local servers, press `Ctrl+C` in each terminal.

