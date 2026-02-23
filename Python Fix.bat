@echo off
title Python Installation Helper
echo ========================================
echo        Python Installation Helper
echo ========================================
echo.

echo Checking if Python is installed...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python is already installed!
    python --version
    echo.
    echo You can now start the game!
    pause
    exit /b 0
) else (
    echo Python is not installed or not in PATH
)

echo.
echo Checking system information...
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

echo.
echo ========================================
echo Installation Options:
echo ========================================
echo.
echo Option 1 - Microsoft Store (Easiest):
echo    - Open Microsoft Store
echo    - Search for "Python 3.10"
echo    - Click "Get" or "Install" (Free)
echo.
echo Option 2 - Official Website:
echo    - Visit https://www.python.org/downloads/
echo    - Download Python 3.10.11 (more stable)
echo    - Run as Administrator
echo    - CHECK "Add Python to PATH"
echo.
echo Option 3 - Online Version (No Installation):
echo    - Visit https://replit.com/
echo    - Create Python project
echo    - Copy game code and run online
echo.
echo ========================================
echo.

echo Press any key to open Microsoft Store...
pause >nul

start ms-windows-store://pdp/?productid=9PJPW5LDXLZ5

echo.
echo If Store opened, search for Python and install
echo If Store did not open, open it manually
echo.
pause
