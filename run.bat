@echo off
echo Starting NexOS (JavaScript-only version)...

cd shell
node nexos.js
if %ERRORLEVEL% NEQ 0 (
    echo Error running NexOS!
    pause
    exit /b %ERRORLEVEL%
)

echo NexOS terminated.
pause
