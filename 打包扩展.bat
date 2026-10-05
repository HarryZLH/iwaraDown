@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   iwaraDown 浏览器扩展打包工具
echo ========================================
echo.

set "SOURCE_DIR=%~dp0extension"
set "OUTPUT_FILE=%~dp0iwaraDown-v1.0-extension.zip"

echo [1/3] 检查文件...
if not exist "%SOURCE_DIR%\manifest.json" (
    echo 错误: manifest.json 不存在
    pause
    exit /b 1
)

echo [2/3] 打包扩展...
cd /d "%SOURCE_DIR%"
powershell -Command "Compress-Archive -Path '.\*' -DestinationPath '%OUTPUT_FILE%' -Force"

if errorlevel 1 (
    echo 打包失败
    pause
    exit /b 1
)

echo [3/3] 完成！
echo.
echo 扩展已打包到: %OUTPUT_FILE%
echo.
echo 安装方法:
echo   1. 打开 Edge 浏览器
echo   2. 访问 edge://extensions/
echo   3. 开启"开发人员模式"
echo   4. 点击"加载解压缩的扩展"
echo   5. 选择 extension 文件夹
echo.
pause