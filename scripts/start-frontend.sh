#!/bin/bash

# Script para iniciar o frontend
# Uso: ./scripts/start-frontend.sh

cd "$(dirname "$0")/../apps/frontend"

echo "🚀 Iniciando frontend..."
echo "📁 Diretório: $(pwd)"

# Verificar se backend está rodando
echo "🔍 Verificando se o backend está rodando..."
if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo "✅ Backend está rodando!"
else
    echo "⚠️  Backend não está rodando em http://localhost:4000"
    echo "💡 Inicie o backend primeiro:"
    echo "   cd apps/backend && npm run start:dev"
    echo ""
    read -p "Deseja continuar mesmo assim? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "❌ Cancelado. Inicie o backend primeiro."
        exit 1
    fi
fi

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000
EOF
    echo "✅ Arquivo .env.local criado!"
fi

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo "🎯 Iniciando servidor frontend..."
npm run dev

