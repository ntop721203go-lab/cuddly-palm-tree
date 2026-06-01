@echo off
chcp 65001 >nul
echo ========================================
echo   AI 비서 개발 서버 종료
echo ========================================
echo.

echo 백엔드/프론트엔드 프로세스 종료 중...

REM uvicorn (백엔드) 종료
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Next.js (프론트엔드) 종료 - 여러 포트 확인
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 :3003 :3004" ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo ✅ 모든 서버가 종료되었습니다.
echo.
echo LM Studio는 별도로 종료해주세요.
echo.
pause
