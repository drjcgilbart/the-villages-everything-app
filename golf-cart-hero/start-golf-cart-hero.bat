@echo off
title The Villages Golf Cart Hero
cd /d "%~dp0"

set "NODE_DIR=C:\Program Files\nodejs"
if exist "%NODE_DIR%\node.exe" set "PATH=%NODE_DIR%;%PATH%"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed.
  echo Install it from https://nodejs.org then double-click the desktop icon again.
  pause
  exit /b 1
)

if not exist "node_modules\vite" (
  echo First run - installing packages. This can take a minute...
  echo.
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo Install failed. Check the message above.
    pause
    exit /b 1
  )
)

netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul
if not errorlevel 1 (
  echo Golf Cart Hero is already running. Opening it in your browser...
  start "" "http://localhost:5173/"
  timeout /t 2 /nobreak >nul
  exit /b 0
)

echo.
echo  The Villages Golf Cart Hero
echo  Game:  http://localhost:5173/
echo.
echo  Leave this window open while you play.
echo  Close the window to stop the game server.
echo.

start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:5173/"
call npm.cmd run dev -- --port 5173 --strictPort

echo.
echo Golf Cart Hero stopped.
