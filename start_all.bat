@echo off
echo Starting Monsoon Travel Assistant...
echo.
echo Backend (Django) will run on: http://localhost:8000
echo Frontend (React) will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

start "Django Backend" cmd /k "python manage.py runserver"
timeout /t 3 /nobreak > nul
start "React Frontend" cmd /k "cd travel-assistant-frontend && npm run dev"

echo.
echo Both servers are starting...
echo Check the opened windows for server status
echo.
pause
