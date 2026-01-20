@echo off
chcp 65001 >nul
echo ========================================
echo   SaaS Dashboard - 前端启动
echo ========================================
echo.

echo 正在启动前端开发服务...
echo.
echo   访问地址: http://localhost:3000
echo.
echo   按 Ctrl+C 可停止服务
echo ========================================
echo.

:: 延迟2秒后自动打开浏览器
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

npm run dev
