#!/bin/bash
# ==========================================================
# rollback.sh
# Purpose: Revert to the last successful release
# ==========================================================
set -Eeuo pipefail

cd /opt/vm-platform

echo "========================================"
echo " Starting Rollback Process "
echo "========================================"

RELEASE_FILE="/opt/vm-platform/infra/.releases/last_stable.txt"

if [ ! -f "$RELEASE_FILE" ]; then
    echo "ERROR: Rollback state not found at $RELEASE_FILE. Cannot rollback."
    exit 1
fi

LAST_COMMIT=$(cat "$RELEASE_FILE")

echo "[1/3] Restoring previous commit ($LAST_COMMIT)..."
git checkout main
git reset --hard "$LAST_COMMIT"

echo "[2/3] Rebuilding stack..."
docker compose --env-file .env -p vm-platform -f infra/docker/docker-compose.prod.yml up -d --build

echo "[3/3] Checking health..."
sleep 5
if bash infra/scripts/healthcheck.sh; then
    echo "========================================"
    echo " Rollback completed successfully! "
    echo " Restored commit: $LAST_COMMIT"
    echo "========================================"
    exit 0
else
    echo "ERROR: Rollback failed healthcheck! Stack might still be broken."
    exit 1
fi
