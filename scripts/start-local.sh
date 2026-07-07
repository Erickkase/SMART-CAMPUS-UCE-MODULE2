#!/usr/bin/env bash
# Start all SMART CAMPUS UCE Module 2 services locally without databases.
# Each backend runs with in-memory repositories (DB_ENABLED=false / MONGO_ENABLED=false).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGS_DIR="$ROOT_DIR/logs"

apps=(
  scholarship-service
  socioeconomic-form-service
  psychological-care-service
  subject-service
  enrollment-service
  student-service
  notification-service
  api-gateway
)

mkdir -p "$LOGS_DIR"

cd "$ROOT_DIR"

echo "====================================="
echo "SMART CAMPUS UCE - Local startup"
echo "====================================="

# Ensure local environment files exist.
echo "[1/4] Preparing local .env files..."
for app in "${apps[@]}" welfare-frontend; do
  env_file="apps/$app/.env"
  if [[ "$app" == "welfare-frontend" ]]; then
    env_file="apps/$app/.env.local"
  fi

  if [[ ! -f "$env_file" ]]; then
    cp "apps/$app/.env.example" "$env_file"
    echo "  Created $env_file"
  fi
done

# Fix psychological-care-service local port to avoid collision with the frontend
# and to match the URL expected by api-gateway and welfare-frontend.
if grep -q "^PORT=3003$" apps/psychological-care-service/.env; then
  sed -i 's/^PORT=3003$/PORT=3002/' apps/psychological-care-service/.env
  echo "  Fixed psychological-care-service port to 3002"
fi

# Build all backends.
echo "[2/4] Building backend services..."
for app in "${apps[@]}"; do
  echo "  Building $app..."
  npx nest build "$app" > "$LOGS_DIR/${app}-build.log" 2>&1
done

# Start backend services in the background.
echo "[3/4] Starting backend services..."
for app in "${apps[@]}"; do
  if [[ "$app" == "api-gateway" ]]; then
    continue
  fi

  stdbuf -oL nohup node "dist/apps/$app/main.js" > "$LOGS_DIR/${app}.log" 2>&1 &
  echo $! > "$LOGS_DIR/${app}.pid"
  echo "  $app started (PID $!)"
done

# Wait for backend services to be healthy before starting the gateway.
echo "  Waiting for backend services to be ready..."
sleep 45

# Start API gateway after the backends.
stdbuf -oL nohup node "dist/apps/api-gateway/main.js" > "$LOGS_DIR/api-gateway.log" 2>&1 &
echo $! > "$LOGS_DIR/api-gateway.pid"
echo "  api-gateway started (PID $!)"

# Start frontend.
echo "[4/4] Starting welfare-frontend..."
cd "$ROOT_DIR/apps/welfare-frontend"
stdbuf -oL nohup npm run dev > "$LOGS_DIR/welfare-frontend.log" 2>&1 &
echo $! > "$LOGS_DIR/welfare-frontend.pid"
echo "  welfare-frontend started (PID $!)"

cd "$ROOT_DIR"

echo ""
echo "====================================="
echo "All services are starting up"
echo "====================================="
echo "scholarship-service          -> http://localhost:3000"
echo "socioeconomic-form-service   -> http://localhost:3001"
echo "psychological-care-service   -> http://localhost:3002"
echo "subject-service              -> http://localhost:3004"
echo "enrollment-service           -> http://localhost:3005"
echo "student-service              -> http://localhost:3006"
echo "notification-service         -> http://localhost:3007"
echo "api-gateway                  -> http://localhost:8080"
echo "welfare-frontend             -> http://localhost:3003"
echo ""
echo "Logs are available in: $LOGS_DIR"
echo "Run scripts/stop-local.sh to stop all services."
