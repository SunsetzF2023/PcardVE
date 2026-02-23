@echo off
title Plants vs Zombies Heroes - Card Battle Game
echo ========================================
echo    Plants vs Zombies Heroes
echo       Card Battle Game
echo ========================================
echo.
echo Starting game...
echo.

cd /d "%~dp0"
python main.py

if errorlevel 1 (
    echo.
    echo Game failed to start! Python may not be installed.
    echo.
    echo If Python is not installed, please follow these steps:
    echo 1. Visit https://www.python.org/downloads/
    echo 2. Download the latest Python version
    echo 3. During installation, CHECK "Add Python to PATH"
    echo 4. After installation, run this file again
    echo.
    echo Alternative: Install Python from Microsoft Store
    echo 1. Open Microsoft Store
    echo 2. Search for "Python 3.10" or "Python 3.11"
    echo 3. Click "Get" or "Install"
    echo.
    echo Or check the installation guide for detailed help
    echo.
    pause
)
