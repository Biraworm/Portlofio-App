#!/bin/bash
set -e

echo "Current directory: $(pwd)"
echo "Listing contents:"
ls -la

# Navigate to frontend directory
if [ -d "apps/frontend" ]; then
  echo "Found apps/frontend directory"
  cd apps/frontend
elif [ -d "frontend" ]; then
  echo "Found frontend directory"
  cd frontend
else
  echo "ERROR: Could not find frontend directory"
  exit 1
fi

echo "Current directory after cd: $(pwd)"
echo "Checking for package.json:"
ls -la package.json

echo "Checking Next.js version:"
cat package.json | grep -A 2 '"next"'

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Build
echo "Building Next.js app..."
npm run build

echo "Build completed successfully!"
