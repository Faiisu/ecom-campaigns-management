# Ecom System Deployment

This repository contains the Go/Fiber backend, React/Vite frontend, and deployment assets for running the stack with Docker Compose.

## Prerequisites
- Docker Desktop (or Docker Engine) with the Compose plugin
- Reachable MongoDB instance and connection string
- Host ports 3001 (frontend) and 8081 (backend API) available (or adjust compose ports to your needs)

## Layout
- backend/: Go API (Fiber) with Swagger at /swagger/index.html
- frontend/: React/Vite UI built with Tailwind and served by Nginx in production
- deploy/: Dockerfiles, docker-compose.yml, and Nginx config for production build

## Configure environment
Create a `.env` file next to deploy/docker-compose.yml:

```env
# Mongo settings (required by the API container)
MONGO_URL=mongodb+srv://<user>:<password>@<host>/
MONGO_DB_NAME=ecom-system
BACKEND_PORT=8081

# Frontend build-time API base URL (what the browser will call)
VITE_BACKEND_URL=http://localhost:8081
FRONTEND_PORT=3001
```

Notes:
- Provide a MongoDB URI that is reachable from the backend container (Atlas URI works fine).
- If you need a local database quickly, you can run `docker run -d --name ecom-mongo -p 27017:27017 -v ecom-mongo-data:/data/db mongo:7` before composing.
- Keep ports consistent: if you set `BACKEND_PORT` or `FRONTEND_PORT` here, update the port mappings in `docker-compose.yml` so host ports match.

## Build and run with Docker Compose
From the repo root:

```bash
cd deploy
docker compose up --build -d
```

What this does:
- Builds the Go API using deploy/backend.Dockerfile and runs it on port 8081 (or the `BACKEND_PORT` you set).
- Builds the React app with VITE_BACKEND_URL baked in, then serves it via Nginx on port 3001 (or the `FRONTEND_PORT` you set).
- Nginx also proxies /api/* to the backend container if you want to introduce an /api prefix later.

## Verify
- Check containers: `docker compose ps`
- Backend health: `curl http://localhost:8081/health` (or your mapped port)
- API docs: `http://localhost:8081/swagger/index.html`
- Frontend: `http://localhost:3001`
- Logs: `docker compose logs -f backend` (or frontend)

## Stop / update
- Stop and remove containers: `docker compose down`
- Clean remove (remove containers/image) `docker compose down --rmi all`
- Rebuild after code changes: `docker compose up --build -d`

