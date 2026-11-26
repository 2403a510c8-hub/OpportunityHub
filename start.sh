#!/bin/bash
echo "========================================================"
echo "       🚀 Starting Opportunity Hub Web Application"
echo "========================================================"
echo ""

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "[1/3] Checking Backend dependencies..."
if [ ! -d "$ROOT_DIR/backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd "$ROOT_DIR/backend" && npm install
fi

echo "[2/3] Checking Frontend dependencies..."
if [ ! -d "$ROOT_DIR/frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd "$ROOT_DIR/frontend" && npm install
fi

echo "[3/3] Launching servers..."
cd "$ROOT_DIR/backend" && npm run dev &
BACKEND_PID=$!

sleep 2

cd "$ROOT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================================"
echo "  ✅ Opportunity Hub is running!"
echo "  🔗 Frontend URL: http://localhost:5173"
echo "  📡 Backend API:  http://localhost:5000/api"
echo "========================================================"
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
