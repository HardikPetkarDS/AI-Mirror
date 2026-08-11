# Start FastAPI Backend Server
Write-Host "Starting AI Mirror FastAPI Backend on http://localhost:8000..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\..\backend"
$env:PYTHONPATH = "..;."
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
