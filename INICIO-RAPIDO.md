# 🚀 Início Rápido - Portfolio App

## ⚡ Comando Único (Mais Fácil)

```bash
npm run start:simple
```

Este comando:
- ✅ Verifica se o backend está rodando
- ✅ Se não estiver, inicia automaticamente
- ✅ Inicia o frontend
- ✅ Tudo em um único comando!

## 📱 Acessar

Após executar o comando acima:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

## 🔐 Login

- **Email**: `test@example.com`
- **Senha**: `test123456`

## 🛑 Parar

Pressione `Ctrl+C` no terminal ou execute:
```bash
npm run stop
```

## 🔧 Outras Opções

### Iniciar tudo manualmente
```bash
npm run start
```

### Iniciar apenas frontend (backend deve estar rodando)
```bash
cd apps/frontend
npm run dev:only
```

### Iniciar apenas backend
```bash
cd apps/backend
npm run start:dev
```

## ⚙️ Variáveis de Ambiente

Antes de rodar em produção (ou no Vercel), configure:

```bash
# Frontend (apps/frontend/.env.local ou Vercel ENV)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Backend (apps/backend/.env)
DATABASE_URL=postgresql://postgres:password@host:5432/postgres?sslmode=require
JWT_SECRET=your-super-secret-key
FINNHUB_API_KEY=
```

> Use o arquivo `env.example` como referência e lembre-se de definir essas variáveis também no painel da Vercel (Project Settings → Environment Variables).

## ❓ Problemas?

Se o backend não iniciar automaticamente:
1. Execute manualmente: `cd apps/backend && npm run start:dev`
2. Aguarde alguns segundos
3. Recarregue o frontend

