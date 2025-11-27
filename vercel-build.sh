#!/bin/bash
set -e

echo "=== Vercel Build Script ==="
echo "Current directory: $(pwd)"
echo "Listing contents:"
ls -la

# Check if we're already in the frontend directory (Root Directory is set to apps/frontend)
if [ -f "package.json" ] && [ -f "next.config.js" ]; then
  echo "✓ Already in frontend directory (Root Directory is set correctly)"
  FRONTEND_DIR="."
# Check if we need to navigate to apps/frontend
elif [ -d "apps/frontend" ]; then
  echo "✓ Found apps/frontend directory, navigating..."
  cd apps/frontend
  FRONTEND_DIR="apps/frontend"
elif [ -d "frontend" ]; then
  echo "✓ Found frontend directory, navigating..."
  cd frontend
  FRONTEND_DIR="frontend"
else
  echo "✗ ERROR: Could not find frontend directory"
  echo "Available directories:"
  ls -la
  exit 1
fi

echo "Current directory after navigation: $(pwd)"
echo "Checking for package.json:"
if [ -f "package.json" ]; then
  echo "✓ package.json found"
  echo "Next.js version:"
  cat package.json | grep '"next"' || echo "Next.js not found in package.json"
else
  echo "✗ ERROR: package.json not found"
  exit 1
fi

# Install dependencies
echo "=== Installing dependencies ==="
npm install --legacy-peer-deps || {
  echo "✗ npm install failed"
  exit 1
}

echo "✓ Dependencies installed"

# Build
echo "=== Building Next.js app ==="
npm run build || {
  echo "✗ Build failed"
  echo "Build error details above"
  exit 1
}

echo "✓ Build completed successfully!"
