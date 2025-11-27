#!/bin/bash

# Script para garantir que o backend está rodando
# Pode ser chamado antes de iniciar o frontend

set -e

BACKEND_URL="http://localhost:4000/health"
MAX_ATTEMPTS=30
ATTEMPT=0

echo "🔍 Verificando se o backend está rodando..."

# Verificar se backend já está rodando
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s "$BACKEND_URL" > /dev/null 2>&1; then
        echo "✅ Backend está rodando!"
        exit 0
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

# Se chegou aqui, backend não está rodando
echo "⚠️  Backend não está rodando. Tentando iniciar..."

cd "$(dirname "$0")/../apps/backend"

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:nfp53tQdQH0lZFvv@db.kxbjvammpfeozaelvfwo.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
FINNHUB_API_KEY=""
EOF
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    npm install
fi

# Gerar Prisma Client se necessário
if [ ! -d "../node_modules/.prisma/client" ] && [ ! -d "node_modules/.prisma/client" ]; then
    echo "🔧 Gerando Prisma Client..."
    npm run prisma:generate || true
fi

# Iniciar backend em background
echo "🚀 Iniciando backend..."
npm run start:dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > /tmp/portfolio-backend.pid

echo "⏳ Aguardando backend iniciar (PID: $BACKEND_PID)..."

# Aguardar backend iniciar
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s "$BACKEND_URL" > /dev/null 2>&1; then
        echo "✅ Backend iniciado com sucesso!"
        echo "📡 Backend rodando em http://localhost:4000"
        exit 0
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
done

echo "❌ Backend não iniciou após $MAX_ATTEMPTS segundos"
echo "📋 Verifique os logs em /tmp/backend.log"
exit 1

