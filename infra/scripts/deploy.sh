#!/bin/bash
# ==========================================================
# deploy.sh
# Purpose: Pull latest code, build and start docker containers
# ==========================================================
set -Eeuo pipefail

cd /opt/vm-platform

echo "========================================"
echo " Starting VM Platform Deployment "
echo "========================================"

echo "[1/6] Validating dependencies..."
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found in /opt/vm-platform!"
    exit 1
fi

echo "Exporting environment variables..."
set -a
source .env
set +a

echo "[2/6] Saving current state for potential rollback..."
PREVIOUS_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "")
mkdir -p /opt/vm-platform/infra/.releases
if [ -n "$PREVIOUS_COMMIT" ]; then
    echo "$PREVIOUS_COMMIT" > /opt/vm-platform/infra/.releases/last_stable.txt
    echo "Snapshot saved: $PREVIOUS_COMMIT"
else
    echo "WARNING: No previous commit found. This might be the first deploy."
fi

echo "[3/6] Pulling latest code..."
git fetch origin main
if [ -n "$(git status --porcelain)" ]; then
    echo "ERROR: Working tree is not clean. Aborting deploy to avoid overwriting local changes."
    exit 1
fi
git checkout main
git pull --ff-only origin main

echo "[4/6] Validating Docker Compose..."
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml config > /dev/null

echo "[5/6] Building and starting the stack..."
docker compose --env-file .env -p vm-platform -f infra/docker/docker-compose.prod.yml up -d --build

echo "[6/6] Checking health..."
echo "Waiting for container to be ready..."

MAX_ATTEMPTS=20
SLEEP_TIME=3
ATTEMPT=1
HEALTHY=false

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "Healthcheck attempt $ATTEMPT of $MAX_ATTEMPTS..."
    if bash infra/scripts/healthcheck.sh; then
        HEALTHY=true
        break
    fi
    sleep $SLEEP_TIME
    ATTEMPT=$((ATTEMPT + 1))
done

if [ "$HEALTHY" = true ]; then
    echo "Healthcheck passed!"
    echo "Cleaning up old images..."
    docker image prune -f
    echo "========================================"
    echo " Deployment completed successfully! "
    docker ps -f name=vm-platform-web
    echo "========================================"
    exit 0
else
    echo "ERROR: Healthcheck failed after $MAX_ATTEMPTS attempts."
    echo "Initiating automatic rollback..."
    
    if bash infra/scripts/rollback.sh; then
        echo "Rollback was successful. The deployment failed."
    else
        echo "CRITICAL: The deployment failed and rollback also failed!"
    fi
    
    exit 1
fi
