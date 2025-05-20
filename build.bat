@echo off
echo Building SimOS (JavaScript-only version)...

:: Create NexOS files directory if it doesn't exist
echo Creating SimOS files directory...
cd /d %~dp0
cd ..
if not exist nexos-files mkdir nexos-files

echo Build complete!
echo To run SimOS, execute: run.bat
pause
