@echo off
cd /d "%~dp0app"
echo Vercelにログインします（ブラウザが開きます）...
npx vercel login
echo.
echo デプロイ中...
npx vercel --prod
pause
