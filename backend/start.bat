@echo off
chcp 65001 >nul
echo ========================================
echo   SaaS Dashboard - 后端启动
echo ========================================
echo.

echo 正在启动后端 API 服务...
echo.
echo   API 地址: http://localhost:8080/api/dashboard
echo.
echo   按 Ctrl+C 可停止服务
echo ========================================
echo.

node server.js
