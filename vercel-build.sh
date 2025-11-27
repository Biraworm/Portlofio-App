#!/bin/bash
set -e

# Navigate to frontend directory
cd apps/frontend

# Install dependencies
npm install --legacy-peer-deps

# Build
npm run build

