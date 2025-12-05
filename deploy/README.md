# Ecom System Deployment

This repository contains the Go/Fiber backend, React/Vite frontend, and deployment assets for running the stack with Docker Compose.

## Prerequisites
- Docker Desktop (or Docker Engine) with the Compose plugin
- Reachable MongoDB instance and connection string
- Host ports 80 (frontend via Nginx) and 8080 (backend API) available

## Layout
- backend/: Go API (Fiber) with Swagger at /swagger/index.html
- frontend/: React/Vite UI built with Tailwind and served by Nginx in production
- deploy/: Dockerfiles, docker-compose.yml, and Nginx config for production build

## Configure environment
Create a .env file next to deploy/docker-compose.yml:

```env
# Mongo settings (required by the API container)
MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=ecom-system

# Frontend build-time API base URL (what the browser will call)
VITE_BACKEND_URL=http://localhost:8080
```

Notes:
- Provide a MongoDB URI that is reachable from the backend container (Atlas URI works fine).
- If you need a local database quickly, you can run `docker run -d --name ecom-mongo -p 27017:27017 -v ecom-mongo-data:/data/db mongo:7` before composing.

## Build and run with Docker Compose
From the repo root:

```bash
cd deploy
docker compose up --build -d
```

What this does:
- Builds the Go API using deploy/backend.Dockerfile and runs it on port 8080.
- Builds the React app with VITE_BACKEND_URL baked in, then serves it via Nginx on port 80.
- Nginx also proxies /api/* to the backend container if you want to introduce an /api prefix later.

## Verify
- Check containers: `docker compose ps`
- Backend health: `curl http://localhost:8080/health`
- API docs: `http://localhost/swagger/index.html`
- Frontend: `http://localhost`
- Logs: `docker compose logs -f backend` (or frontend)

## Stop / update
- Stop and remove containers: `docker compose down`
- Rebuild after code changes: `docker compose up --build -d`
- Remove build cache if needed: `docker builder prune`

## Troubleshooting
- Connection issues to MongoDB usually mean the URI is wrong or not reachable from the container network.
- If ports 80/8080 are occupied, change the published ports in deploy/docker-compose.yml to free ones and update VITE_BACKEND_URL accordingly.
- Frontend API calls use the value baked into VITE_BACKEND_URL at build time; rebuild the frontend if you change it.
