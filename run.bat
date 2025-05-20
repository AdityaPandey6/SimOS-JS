@echo off
REM Windows batch script to run NexOS
cd /d %~dp0
cd ..
node shell/simos.js
