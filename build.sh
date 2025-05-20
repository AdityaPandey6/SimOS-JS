#!/bin/bash

# NexOS Build Script (JavaScript-only version)

echo "Building NexOS (JavaScript-only version)..."

# Create NexOS files directory if it doesn't exist
echo "Creating NexOS files directory..."
dirname=$(dirname "$0")
cd "$dirname"
cd ..
[ -d simos-files ] || mkdir simos-files

echo "Build complete!"
echo "To run SimOS, execute: ./run.sh"
