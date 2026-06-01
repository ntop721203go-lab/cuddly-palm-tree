@echo off
chcp 65001 >nul
echo ========================================
echo   AI 비서 개발 서버 시작
echo ========================================
echo.

REM LM Studio 상태 확인
echo [1/3] LM Studio 상태 확인...
curl -s http://localhost:1234/v1/models >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ LM Studio가 실행되지 않았습니다.
    echo    LM Studio를 실행하고 Local Server를 시작해주세요.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ LM Studio 정상 실행 중
)
echo.

REM 백엔드 시작
echo [2/3] 백엔드 서버 시작 중...
cd /d "%~dp0backend"
start "AI 비서 백엔드" cmd /k "set USE_LM_STUDIO=true && .venv\Scripts\uvicorn main:app --port 8000 --reload"
timeout /t 3 >nul
echo ✅ 백엔드 시작됨 (http://localhost:8000)
echo.

REM 프론트엔드 시작
echo [3/3] 프론트엔드 서버 시작 중...
cd /d "%~dp0frontend"
start "AI 비서 프론트엔드" cmd /k "npm run dev"
timeout /t 3 >nul
echo ✅ 프론트엔드 시작 대기 중...
echo.

echo ========================================
echo   모든 서버가 시작되었습니다!
echo ========================================
echo.
echo 프론트엔드: http://localhost:3000 (또는 자동 할당된 포트)
echo 백엔드: http://localhost:8000
echo.
echo 종료하려면 각 터미널 창에서 Ctrl+C를 누르세요.
echo.
pause
