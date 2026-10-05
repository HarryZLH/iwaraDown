@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   iwaraDown（byHarryZhang）自动更新脚本
echo ========================================
echo.

set "BASE_DIR=%~dp0"
set "DOWNLOAD_URL=https://github.com/HarryZhang/iwaraDown/raw/main/iwaraDown.user.js"
set "TEMP_FILE=%TEMP%\iwaraDown.user.js"

:: 下载最新版本
echo [1/4] 正在下载最新版本...
curl -L -o "%TEMP_FILE%" "%DOWNLOAD_URL%" 2>nul
if errorlevel 1 (
    echo 下载失败，请检查网络连接
    pause
    exit /b 1
)

:: 提取版本号
echo [2/4] 正在解析版本号...
for /f "tokens=3" %%a in ('findstr /C:"@version" "%TEMP_FILE%"') do set "VERSION=%%a"

if "%VERSION%"=="" (
    echo 无法解析版本号
    pause
    exit /b 1
)

echo     当前版本: v%VERSION%

:: 检查是否已存在
set "VERSION_DIR=%BASE_DIR%v%VERSION%"
if exist "%VERSION_DIR%\iwaraDown.user.js" (
    echo [3/4] 版本 v%VERSION% 已存在，跳过保存
) else (
    echo [3/4] 正在保存到 %VERSION_DIR%\
    mkdir "%VERSION_DIR%" 2>nul
    copy "%TEMP_FILE%" "%VERSION_DIR%\iwaraDown.user.js" >nul
    echo     保存成功！
)

:: 清理临时文件
echo [4/4] 清理临时文件...
del "%TEMP_FILE%" 2>nul

echo.
echo ========================================
echo   完成！版本: v%VERSION%
echo   保存位置: %VERSION_DIR%
echo ========================================
echo.
echo 提示：在 Tampermonkey 中更新脚本：
echo   1. 打开 Tampermonkey 管理面板
echo   2. 找到 iwaraDown（byHarryZhang）
echo   3. 点击 "从文件导入" 或 "从URL更新"
echo.
pause