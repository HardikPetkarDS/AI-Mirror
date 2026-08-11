# AI Mirror Environment Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Setting up AI Mirror Development Suite " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Add Node.js portable path if needed
$NodePath = "C:\Users\Dell\.gemini\nodejs\node-v20.18.0-win-x64"
if (Test-Path $NodePath) {
    $env:PATH = "$NodePath;$env:PATH"
    Write-Host "[Node] Configured portable Node.js v20." -ForegroundColor Green
}

# 2. Setup Backend Dependencies & Database
Write-Host "`n[Backend] Installing Python requirements..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\backend"
python -m pip install -r requirements.txt

Write-Host "[Backend] Initializing database & seeding catalog..." -ForegroundColor Yellow
python database/seed_db.py

# 3. Setup Frontend Dependencies
Write-Host "`n[Frontend] Installing NPM dependencies..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\frontend"
npm install

Write-Host "`n[Setup Complete] All services ready!" -ForegroundColor Green
Write-Host "Run .\scripts\start_backend.ps1 in Terminal 1" -ForegroundColor Gray
Write-Host "Run .\scripts\start_frontend.ps1 in Terminal 2" -ForegroundColor Gray
