# Scripts de Utilidade

## Criar Usuário de Teste

Para criar um usuário de teste no banco de dados:

```bash
cd apps/backend
npm run create:test-user
```

Isso criará um usuário com:
- **Email**: `test@example.com`
- **Password**: `test123456`

O script verifica se o usuário já existe antes de criar. Se já existir, apenas mostra as informações.

### Pré-requisitos

1. Certifique-se de que o arquivo `.env` está configurado com `DATABASE_URL`
2. Certifique-se de que as migrações do Prisma foram executadas:
   ```bash
   npm run migrate:dev
   ```
3. Certifique-se de que o Prisma Client foi gerado:
   ```bash
   npm run prisma:generate
   ```

### Exemplo de uso

```bash
# 1. Configure o .env
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio"' > .env

# 2. Execute as migrações
npm run migrate:dev

# 3. Crie o usuário de teste
npm run create:test-user

# 4. Agora você pode fazer login com:
# Email: test@example.com
# Password: test123456
```

