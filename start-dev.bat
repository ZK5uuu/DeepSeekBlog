@echo off
echo Starting DeepSeekBlogAPP Development Environment...
echo.

cd backend
start cmd /k "echo Starting Backend Server... && mvn spring-boot:run"

cd ../front
start cmd /k "echo Starting Frontend Server... && npm run dev"

echo Both servers should be starting now!
echo Backend will be available at http://localhost:8080
echo Frontend will be available at http://localhost:3000
echo. 