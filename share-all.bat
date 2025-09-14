@echo off
echo Starting backend...
start cmd /k "cd backend && npm start"
timeout /t 5

echo Starting frontend...
start cmd /k "cd frontend && npm run dev -- --host"
timeout /t 5

echo Starting ngrok...
ngrok http -auth="client:123456" 5173

pause
