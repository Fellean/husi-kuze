@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Chybi Node.js. Nainstaluj aktualni LTS verzi z https://nodejs.org/
  echo a potom tenhle soubor spust znovu.
  echo.
  pause
  exit /b 1
)

start "" "http://127.0.0.1:8765"
node local-editor\server.mjs

if errorlevel 1 (
  echo.
  echo Editor se nepodarilo spustit. Chybova zprava je vyse.
  pause
)
