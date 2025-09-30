@echo off
REM Company Reimbursement Application Startup Script for Windows

echo 🚀 Starting Company Reimbursement Application...
echo ==============================================

REM Check if Docker is running
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ docker-compose is not installed. Please install Docker Compose.
    pause
    exit /b 1
)

REM Build and start the application
echo 🔨 Building and starting containers...
docker-compose up --build -d

REM Wait a moment for services to start
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo ✅ Application started successfully!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔗 Backend API: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.
echo 🛑 To stop the application, run: docker-compose down
echo.
pause