#!/bin/bash

# Script para parar os servidores
# Uso: ./scripts/stop.sh

echo "🛑 Parando servidores..."

# Parar backend
if [ -f /tmp/portfolio-backend.pid ]; then
    BACKEND_PID=$(cat /tmp/portfolio-backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "🛑 Parando backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
        rm /tmp/portfolio-backend.pid
    fi
fi

# Parar processos na porta 4000
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "🛑 Parando processo na porta 4000..."
    lsof -ti :4000 | xargs kill -9 2>/dev/null || true
fi

# Parar frontend
if [ -f /tmp/portfolio-frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/portfolio-frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "🛑 Parando frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
        rm /tmp/portfolio-frontend.pid
    fi
fi

# Parar processos na porta 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "🛑 Parando processo na porta 3000..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
fi

echo "✅ Servidores parados!"

