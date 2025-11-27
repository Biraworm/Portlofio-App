# 🚀 Como Iniciar o Projeto

## ⚡ Início Rápido

### Opção 1: Usar Scripts Auxiliares (Recomendado)

```bash
# Terminal 1 - Iniciar Backend
./scripts/start-backend.sh

# Terminal 2 - Iniciar Frontend
./scripts/start-frontend.sh
```

### Opção 2: Usar npm scripts do root

```bash
# Inicia ambos (backend e frontend) ao mesmo tempo
npm run dev
```

### Opção 3: Iniciar Manualmente

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev
```

## ✅ Verificação

### Backend está rodando?
Acesse: http://localhost:4000/health

Deve retornar:
```json
{
  "status": "ok",
  "message": "Backend is running",
  "timestamp": "..."
}
```

### Frontend está rodando?
Acesse: http://localhost:3000

Você verá a página de login.

## 🔧 Troubleshooting

### Erro: "Network Error" ou "Backend não está rodando"

**Solução:**
1. Verifique se o backend está rodando:
   ```bash
   curl http://localhost:4000/health
   ```

2. Se não estiver, inicie:
   ```bash
   cd apps/backend
   npm run start:dev
   ```

3. Verifique se a porta 4000 está livre:
   ```bash
   lsof -i :4000
   ```

### Erro: Porta já em uso

**Solução:**
1. Encontre o processo usando a porta:
   ```bash
   lsof -i :4000
   ```

2. Mate o processo:
   ```bash
   kill -9 <PID>
   ```

### Backend não inicia

**Solução:**
1. Verifique se o `.env` existe em `apps/backend/`
2. Verifique se as dependências estão instaladas:
   ```bash
   cd apps/backend
   npm install
   ```
3. Verifique se o Prisma Client está gerado:
   ```bash
   npm run prisma:generate
   ```

## 📝 Credenciais de Teste

- **Email**: `test@example.com`
- **Senha**: `test123456`

## 🎯 Próximos Passos

1. ✅ Inicie o backend
2. ✅ Inicie o frontend
3. ✅ Acesse http://localhost:3000/login
4. ✅ Faça login com as credenciais de teste
5. ✅ Explore a aplicação!

