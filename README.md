# 🚀 Portfolio App

Aplicação completa de gerenciamento de portfólio de investimentos com frontend Next.js e backend NestJS.

## ⚡ Início Rápido

### Opção 1: Script Automático (Recomendado) 🎯

```bash
# Inicia tudo automaticamente (backend + frontend)
npm run start
```

Isso irá:
- ✅ Criar arquivos de configuração (.env) se necessário
- ✅ Instalar dependências se necessário
- ✅ Iniciar backend na porta 4000
- ✅ Iniciar frontend na porta 3000
- ✅ Aguardar ambos estarem prontos

### Opção 2: Scripts Individuais

```bash
# Terminal 1 - Backend
./scripts/start-backend.sh

# Terminal 2 - Frontend
./scripts/start-frontend.sh
```

### Opção 3: npm scripts

```bash
# Inicia ambos ao mesmo tempo
npm run dev
```

## 🛑 Parar Servidores

```bash
npm run stop
# ou
./scripts/stop.sh
```

## 📱 Acessar Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## 🔐 Credenciais de Teste

- **Email**: `test@example.com`
- **Senha**: `test123456`

## 📁 Estrutura do Projeto

```
portfolio-app/
├── apps/
│   ├── frontend/     # Next.js 14 + TypeScript + Tailwind
│   └── backend/       # NestJS + Prisma + PostgreSQL
├── scripts/          # Scripts auxiliares
└── package.json      # Workspace root
```

## 🔧 Configuração

### Backend

O arquivo `.env` será criado automaticamente em `apps/backend/.env`:

```env
DATABASE_URL="postgresql://postgres:password@host:5432/postgres?sslmode=require"
JWT_SECRET="your-secret-key"
FINNHUB_API_KEY=""
```

### Frontend

O arquivo `.env.local` será criado automaticamente em `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🚀 Desenvolvimento

### Backend

```bash
cd apps/backend
npm run start:dev
```

### Frontend

```bash
cd apps/frontend
npm run dev
```

## 📚 Documentação Adicional

- `START-HERE.md` - Guia detalhado de início
- `QUICK-START.md` - Guia rápido
- `SETUP-AUTH.md` - Configuração de autenticação

## 🐛 Troubleshooting

### Backend não inicia

1. Verifique se a porta 4000 está livre:
   ```bash
   lsof -i :4000
   ```

2. Verifique se o `.env` existe em `apps/backend/`

3. Execute as migrações:
   ```bash
   cd apps/backend
   npm run migrate:dev
   ```

### Frontend mostra "Backend não está rodando"

1. Inicie o backend primeiro:
   ```bash
   cd apps/backend
   npm run start:dev
   ```

2. Ou use o script automático:
   ```bash
   npm run start
   ```

### Erro de conexão com banco

1. Verifique se o `DATABASE_URL` está correto
2. Verifique se o banco está acessível
3. Adicione `?sslmode=require` à URL se necessário

## 📝 Scripts Disponíveis

### Root

- `npm run start` - Inicia tudo automaticamente
- `npm run stop` - Para todos os servidores
- `npm run dev` - Inicia backend e frontend simultaneamente

### Backend

- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run migrate:dev` - Executa migrações
- `npm run create:test-user` - Cria usuário de teste

### Frontend

- `npm run dev` - Inicia em modo desenvolvimento
- `npm run build` - Build de produção

## 🎯 Próximos Passos

1. ✅ Execute `npm run start` para iniciar tudo
2. ✅ Acesse http://localhost:3000/login
3. ✅ Faça login com as credenciais de teste
4. ✅ Explore a aplicação!

## 📄 Licença

Private
