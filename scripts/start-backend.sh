#!/bin/bash

# Script para iniciar o backend
# Uso: ./scripts/start-backend.sh

cd "$(dirname "$0")/../apps/backend"

echo "🚀 Iniciando backend..."
echo "📁 Diretório: $(pwd)"

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando arquivo .env..."
    cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:nfp53tQdQH0lZFvv@db.kxbjvammpfeozaelvfwo.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
FINNHUB_API_KEY=""
EOF
    echo "✅ Arquivo .env criado!"
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se Prisma Client está gerado
if [ ! -d "../node_modules/.prisma/client" ] && [ ! -d "node_modules/.prisma/client" ]; then
    echo "🔧 Gerando Prisma Client..."
    npm run prisma:generate
fi

echo "🎯 Iniciando servidor backend..."
npm run start:dev

