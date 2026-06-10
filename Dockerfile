# ── Stage 1: React Build ─────────────────────────────────────────────────
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY ../../Downloads/flowra/frontend ./
RUN npm run build

# ── Stage 2: Python Backend ───────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Python dependencies
COPY ../../Downloads/flowra/backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Backend code
COPY ../../Downloads/flowra/backend/main.py ./

# React build output from stage 1
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Persistent volume for SQLite DB
VOLUME ["/app/data"]

EXPOSE 9876

CMD ["python", "main.py"]
