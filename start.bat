@echo off
cd /d "%~dp0"
echo.
echo  The Villages Idiot
echo  ------------------
echo  Starting local site at http://localhost:3000
echo  Studio (admin):     http://localhost:3000/admin
echo  Default password:   changeme  (see .env.local)
echo.
if not exist "node_modules" (
  echo Installing dependencies...
  call npm.cmd install
)
call npm.cmd run dev
