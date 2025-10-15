@echo off
echo Starting Secure Chat App...

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed!
    echo Please install Node.js v16 or higher from https://nodejs.org
    pause
    exit /b 1
)

REM Create .env files if they don't exist
if not exist backend\.env (
    if exist backend\.env.example (
        copy backend\.env.example backend\.env
        echo Created backend/.env from example
    )
)

if not exist frontend\.env.local (
    if exist frontend\.env.example (
        copy frontend\.env.example frontend\.env.local
        echo Created frontend/.env.local from example
    )
)

REM Install dependencies if node_modules doesn't exist
if not exist backend\node_modules (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist frontend\node_modules (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Start backend and frontend in separate windows
echo Starting backend server...
start "Secure Chat Backend" cmd /c "cd backend && npm run dev"

echo Starting frontend development server...
start "Secure Chat Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo Secure Chat App is starting up...
echo The application will be available at http://localhost:5173
echo.
echo Press any key to open the chat application in your default browser...
pause >nul

start http://localhost:5173
