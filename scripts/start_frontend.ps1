# Start Next.js Frontend Server
Write-Host "Starting AI Mirror Next.js Frontend on http://localhost:3000..." -ForegroundColor Cyan
$NodePath = "C:\Users\Dell\.gemini\nodejs\node-v20.18.0-win-x64"
if (Test-Path $NodePath) {
    $env:PATH = "$NodePath;$env:PATH"
}
Set-Location -Path "$PSScriptRoot\..\frontend"
npm run dev
