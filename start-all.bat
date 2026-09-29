@echo off
echo ========================================================
echo Starting Smart Job Portal & ATS Resume Analyzer...
echo ========================================================

start "JobPortal-Backend" cmd /k "cd /d "%~dp0backend" && .\mvnw.cmd spring-boot:run"
timeout /t 5 >nul
start "JobPortal-Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Backend is starting at: http://localhost:8080
echo Frontend will open at:  http://localhost:5173
echo.
pause
