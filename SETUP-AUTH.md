# 🔐 Configuração de Autenticação - Backend API

## ✅ Correções Aplicadas

### 1. **Frontend Integrado com Backend API**
- ✅ Frontend agora usa a API do backend (`/auth/register` e `/auth/login`) ao invés do Supabase
- ✅ Token JWT é armazenado no `localStorage` como `auth_token`
- ✅ Interceptor do axios adiciona automaticamente o token nas requisições
- ✅ Layout do dashboard verifica o token JWT

### 2. **Script para Criar Usuário de Teste**
- ✅ Script criado em `apps/backend/scripts/create-test-user.ts`
- ✅ Comando npm: `npm run create:test-user`
- ✅ Cria usuário com email `test@example.com` e senha `test123456`

## 🚀 Como Configurar e Testar

### Passo 1: Configurar Variáveis de Ambiente do Backend

Crie um arquivo `.env` no diretório `apps/backend/`:

```bash
cd apps/backend
cat > .env << EOF
DATABASE_URL="postgresql://postgres:nfp53tQdQH0lZFvv@db.kxbjvammpfeozaelvfwo.supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
FINNHUB_API_KEY="your-finnhub-api-key"
EOF
```

**Nota**: Se a conexão falhar, pode ser necessário adicionar `?sslmode=require` à URL:

```env
DATABASE_URL="postgresql://postgres:nfp53tQdQH0lZFvv@db.kxbjvammpfeozaelvfwo.supabase.co:5432/postgres?sslmode=require"
```

### Passo 2: Executar Migrações do Prisma

```bash
cd apps/backend
npm run migrate:dev
```

Isso criará as tabelas no banco de dados.

### Passo 3: Criar Usuário de Teste

```bash
cd apps/backend
npm run create:test-user
```

Você verá uma mensagem como:

```
✅ Test user created successfully!
   Email: test@example.com
   ID: abc123...
   Created: 2024-01-01T00:00:00.000Z

📝 You can now login with:
   Email: test@example.com
   Password: test123456
```

### Passo 4: Iniciar o Backend

```bash
cd apps/backend
npm run start:dev
```

O backend deve iniciar em `http://localhost:4000`

### Passo 5: Configurar Frontend

Certifique-se de que o arquivo `.env.local` do frontend está configurado:

```bash
cd apps/frontend
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
EOF
```

# Em produção (Vercel), adicione as mesmas variáveis no painel de Environment Variables.

### Passo 6: Testar Login

1. Inicie o frontend:
   ```bash
   cd apps/frontend
   npm run dev
   ```

2. Acesse `http://localhost:3000/login`

3. Use as credenciais:
   - **Email**: `test@example.com`
   - **Password**: `test123456`

4. Clique em "Login"

5. Você deve ser redirecionado para o dashboard (`/`)

### Passo 7: Testar Sign Up

1. Na página de login, clique em "Sign Up"
2. Preencha um novo email e senha (mínimo 6 caracteres)
3. Clique em "Sign Up"
4. Você deve ser redirecionado para o dashboard

## 🔧 Troubleshooting

### Problema: "Can't reach database server"

**Solução 1**: Verifique se a URL do banco está correta e se o banco está acessível.

**Solução 2**: Adicione `?sslmode=require` à URL:
```env
DATABASE_URL="postgresql://postgres:password@host:5432/db?sslmode=require"
```

**Solução 3**: Verifique se o Supabase permite conexões externas. No dashboard do Supabase:
- Vá em **Settings → Database**
- Verifique se **Connection pooling** está configurado corretamente

### Problema: "Prisma Client not initialized"

**Solução**: Execute:
```bash
cd apps/backend
npm run prisma:generate
```

### Problema: "User already exists"

**Solução**: O script detecta se o usuário já existe e apenas mostra as informações. Isso é normal.

### Problema: "Failed to login" no frontend

**Solução 1**: Verifique se o backend está rodando em `http://localhost:4000`

**Solução 2**: Verifique se `NEXT_PUBLIC_API_URL` está configurado corretamente

**Solução 3**: Abra o console do navegador (F12) e verifique se há erros de CORS ou conexão

### Problema: Token não é enviado nas requisições

**Solução**: Verifique se o token está sendo salvo no `localStorage`:
```javascript
// No console do navegador:
localStorage.getItem('auth_token')
```

Se retornar `null`, o login não está funcionando corretamente.

## 📝 Notas Importantes

1. **Autenticação**: O sistema agora usa JWT do backend, não mais Supabase Auth
2. **Token**: O token JWT é armazenado no `localStorage` como `auth_token`
3. **Validade**: O token expira em 7 dias (configurado no backend)
4. **Segurança**: Em produção, use um `JWT_SECRET` forte e único

## 🎯 Próximos Passos

Após validar o login:
1. Teste criar um ativo
2. Teste criar uma transação
3. Teste visualizar o portfolio
4. Verifique se todas as rotas protegidas estão funcionando

