@echo off
echo Cleaning up Secure Chat App...

REM Stop any running Node.js processes
echo Stopping running processes...
taskkill /F /IM node.exe >nul 2>&1

REM Clean up backend
if exist backend\node_modules (
    echo Cleaning backend dependencies...
    cd backend
    rmdir /S /Q node_modules
    del package-lock.json >nul 2>&1
    cd ..
)

REM Clean up frontend
if exist frontend\node_modules (
    echo Cleaning frontend dependencies...
    cd frontend
    rmdir /S /Q node_modules
    del package-lock.json >nul 2>&1
    cd ..
)

REM Remove environment files
if exist backend\.env (
    del backend\.env
    echo Removed backend/.env
)

if exist frontend\.env.local (
    del frontend\.env.local
    echo Removed frontend/.env.local
)

echo.
echo Cleanup complete! All dependencies and environment files have been removed.
echo To start the application again, run start.bat
echo.
pause
