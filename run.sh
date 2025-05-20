#!/bin/sh
# Unix shell script to run NexOS

echo "Starting SimOs (JavaScript-only version)..."

# Run the JavaScript shell
cd "$(dirname "$0")"
cd ..
node shell/nexos.js

echo "SimOs terminated."
