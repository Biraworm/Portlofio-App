#!/bin/bash

# Script completo para configurar e iniciar o projeto
# Uso: ./scripts/setup-and-start.sh

set -e

echo "🚀 Configurando e iniciando Portfolio App..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se porta está em uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Verificar e configurar backend
echo "📦 Configurando Backend..."
cd "$(dirname "$0")/../apps/backend"

# Criar .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env para o backend..."
    cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:nfp53tQdQH0lZFvv@db.kxbjvammpfeozaelvfwo.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
FINNHUB_API_KEY=""
EOF
    echo -e "${GREEN}✅ Arquivo .env criado!${NC}"
else
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    npm install
fi

# Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npm run prisma:generate || true

# Verificar se backend já está rodando
if check_port 4000; then
    echo -e "${YELLOW}⚠️  Backend já está rodando na porta 4000${NC}"
else
    echo "🚀 Iniciando backend..."
    npm run start:dev &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID" > /tmp/portfolio-backend.pid
    
    # Aguardar backend iniciar
    echo "⏳ Aguardando backend iniciar..."
    for i in {1..30}; do
        if curl -s http://localhost:4000/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend está rodando!${NC}"
            break
        fi
        sleep 1
    done
    
    if ! curl -s http://localhost:4000/health > /dev/null 2>&1; then
        echo -e "${RED}❌ Backend não iniciou corretamente${NC}"
        exit 1
    fi
fi

# Verificar e configurar frontend
echo ""
echo "📦 Configurando Frontend..."
cd "$(dirname "$0")/../apps/frontend"

# Criar .env.local se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local para o frontend..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000
EOF
    echo -e "${GREEN}✅ Arquivo .env.local criado!${NC}"
else
    echo -e "${GREEN}✅ Arquivo .env.local já existe${NC}"
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

# Verificar se frontend já está rodando
if check_port 3000; then
    echo -e "${YELLOW}⚠️  Frontend já está rodando na porta 3000${NC}"
else
    echo "🚀 Iniciando frontend..."
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID" > /tmp/portfolio-frontend.pid
    
    # Aguardar frontend iniciar
    echo "⏳ Aguardando frontend iniciar..."
    sleep 5
    echo -e "${GREEN}✅ Frontend está iniciando!${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Tudo configurado e rodando!${NC}"
echo ""
echo "📱 Acesse:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo ""
echo "🛑 Para parar os servidores:"
echo "   ./scripts/stop.sh"
echo ""

