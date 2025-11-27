# 🚀 Quick Start - Portfolio App

## ⚡ Início Rápido

### 1. Configurar Backend

```bash
cd apps/backend

# Criar arquivo .env
cat > .env << EOF
DATABASE_URL="postgresql://postgres:nfp53tQdQH0lZFvv@db.kxbjvammpfeozaelvfwo.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
FINNHUB_API_KEY=""
EOF

# Instalar dependências (se necessário)
npm install

# Executar migrações
npm run migrate:dev

# Iniciar backend
npm run start:dev
```

O backend deve iniciar em `http://localhost:4000`

### 2. Criar Usuário de Teste

**Opção A: Via API (Recomendado - Backend deve estar rodando)**

```bash
cd apps/backend
npm run create:test-user:api
```

**Opção B: Via Script Direto (Requer acesso direto ao banco)**

```bash
cd apps/backend
npm run create:test-user
```

**Opção C: Via Frontend (Mais fácil)**

1. Inicie o frontend (veja passo 3)
2. Acesse `http://localhost:3000/login`
3. Clique em "Criar Conta"
4. Use:
   - Email: `test@example.com`
   - Senha: `test123456`

### 3. Configurar Frontend

```bash
cd apps/frontend

# Criar arquivo .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
EOF

# Instalar dependências (se necessário)
npm install

# Iniciar frontend
npm run dev
```

O frontend deve iniciar em `http://localhost:3000`

### 4. Fazer Login

1. Acesse `http://localhost:3000/login`
2. Use as credenciais:
   - **Email**: `test@example.com`
   - **Senha**: `test123456`
3. Clique em "Entrar"

## 🔧 Troubleshooting

### Erro: "Network Error" no Frontend

**Causa**: Backend não está rodando ou não está acessível.

**Solução**:
1. Verifique se o backend está rodando:
   ```bash
   curl http://localhost:4000/health
   ```
   Deve retornar: `{"status":"ok","message":"Backend is running",...}`

2. Se não estiver rodando, inicie:
   ```bash
   cd apps/backend
   npm run start:dev
   ```

3. Verifique se a porta 4000 está livre:
   ```bash
   lsof -i :4000
   ```

### Erro: "Can't reach database server"

**Causa**: Banco de dados não está acessível ou credenciais incorretas.

**Solução**:
1. Verifique se o `DATABASE_URL` está correto no `.env`
2. Verifique se o Supabase permite conexões externas
3. Tente adicionar `?sslmode=require` à URL do banco
4. Use a Opção A ou C para criar o usuário (via API ou frontend)

### Erro: "User already exists"

**Solução**: Isso é normal! O usuário já existe. Use as credenciais:
- Email: `test@example.com`
- Senha: `test123456`

### Erro: CORS

**Causa**: Backend não está permitindo requisições do frontend.

**Solução**: O backend já está configurado para aceitar todas as origens em desenvolvimento. Se ainda houver problemas, verifique o arquivo `apps/backend/src/main.ts`.

## 📝 Credenciais de Teste

- **Email**: `test@example.com`
- **Senha**: `test123456`

## 🎯 Próximos Passos

Após fazer login:
1. ✅ Teste criar um ativo
2. ✅ Teste criar uma transação
3. ✅ Teste visualizar o portfolio
4. ✅ Teste registrar dividendos

## 📚 Documentação Adicional

- `SETUP-AUTH.md` - Configuração detalhada de autenticação
- `AUTH-FIX.md` - Correções de autenticação anteriores

