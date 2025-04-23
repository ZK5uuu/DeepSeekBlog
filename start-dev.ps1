Write-Host "Starting DeepSeekBlogAPP Development Environment..." -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "cd ./backend; mvn spring-boot:run"

# Start frontend server
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "cd ./front; npm run dev"

Write-Host ""
Write-Host "Both servers should be starting now!" -ForegroundColor Green
Write-Host "Backend will be available at http://localhost:8080" -ForegroundColor Yellow
Write-Host "Frontend will be available at http://localhost:3000" -ForegroundColor Yellow 