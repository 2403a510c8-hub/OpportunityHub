@echo off
echo ========================================================
echo        🚀 Starting Opportunity Hub Web Application
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Backend dependencies...
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend && npm install && cd ..
)

echo [2/3] Checking Frontend dependencies...
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

echo [3/3] Launching Backend and Frontend servers...
start "Opportunity Hub - Backend API (:5000)" cmd /k "cd /d ""%~dp0backend"" && npm run dev"
timeout /t 2 /nobreak >nul
start "Opportunity Hub - Frontend Web (:5173)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo ========================================================
echo   ✅ Opportunity Hub is starting up!
echo   🔗 Frontend URL: http://localhost:5173
echo   📡 Backend API:  http://localhost:5000/api
echo ========================================================
echo.
pause
