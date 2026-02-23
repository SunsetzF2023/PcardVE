@echo off
title Python安装故障排除
echo ========================================
echo        Python安装故障排除工具
echo ========================================
echo.
echo 正在检查系统环境...
echo.

echo 检查Python是否已安装...
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Python已安装！
    python --version
    echo.
    echo 现在可以启动游戏了！
    pause
    exit /b 0
) else (
    echo ✗ Python未安装或未添加到PATH
)

echo.
echo 检查系统信息...
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
echo.

echo 检查磁盘空间...
dir C:\ | findstr /C:"bytes free"
echo.

echo ========================================
echo 故障排除建议：
echo ========================================
echo.
echo 1. 确保以管理员身份运行安装程序
echo 2. 安装时务必勾选 "Add Python to PATH"
echo 3. 如果还是失败，尝试以下替代方案：
echo.
echo 替代方案A - 使用Microsoft Store安装：
echo    - 打开Microsoft Store
echo    - 搜索 "Python 3.10" 或 "Python 3.11"
echo    - 点击安装（免费）
echo.
echo 替代方案B - 使用便携版：
echo    - 下载便携版Python，无需安装
echo.
echo 替代方案C - 在线运行：
echo    - 访问 https://replit.com/
echo    - 在浏览器中运行Python
echo.
echo ========================================
echo.

echo 按任意键尝试自动打开Microsoft Store...
pause >nul

start ms-windows-store://pdp/?productid=9PJPW5LDXLZ5

echo.
echo 如果Store自动打开，请搜索Python并安装
echo 如果没有自动打开，请手动打开Microsoft Store
echo.
pause
