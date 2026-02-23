@echo off
title 植物大战僵尸英雄 - 卡牌对战
echo ========================================
echo    植物大战僵尸英雄 - 卡牌对战游戏
echo ========================================
echo.
echo 正在启动游戏...
echo.

cd /d "%~dp0"
python main.py

if errorlevel 1 (
    echo.
    echo 启动失败！请检查Python是否已安装。
    echo.
    echo 如果没有安装Python，请按照以下步骤：
    echo 1. 访问 https://www.python.org/downloads/
    echo 2. 下载最新版本的Python
    echo 3. 安装时务必勾选 "Add Python to PATH"
    echo 4. 安装完成后重新运行此文件
    echo.
    echo 或者查看安装指南.md文件获取详细帮助
    echo.
    pause
)
