@echo off
cd /d "%~dp0app"
start "" "http://localhost:5173"
npm run dev -- --host
