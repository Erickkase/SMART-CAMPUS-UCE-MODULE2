#!/usr/bin/env bash
# Stop all locally running SMART CAMPUS UCE Module 2 services.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGS_DIR="$ROOT_DIR/logs"

echo "Stopping local services..."

if [[ -d "$LOGS_DIR" ]]; then
  for pid_file in "$LOGS_DIR"/*.pid; do
    [[ -e "$pid_file" ]] || continue
    pid=$(cat "$pid_file")
    name=$(basename "$pid_file" .pid)
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid"
      echo "  $name stopped (PID $pid)"
    else
      echo "  $name was not running"
    fi
    rm -f "$pid_file"
  done
fi

# Also ensure any residual frontend processes are terminated.
pkill -f "next dev -p 3003" 2>/dev/null || true

echo "All services stopped."
