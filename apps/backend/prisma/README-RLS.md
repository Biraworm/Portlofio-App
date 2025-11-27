# Habilitar Row Level Security (RLS) no Supabase

Este guia explica como habilitar Row Level Security (RLS) no Supabase conforme a [documentação oficial](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Método 1: Via Supabase SQL Editor (Recomendado)

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Copie e cole o conteúdo do arquivo `rls-policies.sql`
5. Clique em **Run** para executar

## Método 2: Via Script Node.js

Se você preferir usar o script automatizado:

```bash
cd apps/backend
export DATABASE_URL="postgresql://postgres:nfp53tQdQH0lZFvv@db.kxbjvammpfeozaelvfwo.supabase.co:5432/postgres"
npm run rls:enable
```

## O que o script faz?

1. **Habilita RLS** em todas as tabelas:
   - `User`
   - `Asset`
   - `Transaction`
   - `Dividend`
   - `PriceHistory`

2. **Cria políticas RLS** que garantem que:
   - Usuários só podem ver/modificar seus próprios dados
   - Usuários autenticados (`authenticated` role) têm acesso
   - Usuários não autenticados (`anon` role) não têm acesso

## Políticas criadas

### User Table
- ✅ SELECT: Usuários podem ver seu próprio perfil
- ✅ UPDATE: Usuários podem atualizar seu próprio perfil

### Asset Table
- ✅ SELECT: Usuários podem ver seus próprios ativos
- ✅ INSERT: Usuários podem criar ativos para si mesmos
- ✅ UPDATE: Usuários podem atualizar seus próprios ativos
- ✅ DELETE: Usuários podem deletar seus próprios ativos

### Transaction Table
- ✅ SELECT: Usuários podem ver suas próprias transações
- ✅ INSERT: Usuários podem criar transações para si mesmos
- ✅ UPDATE: Usuários podem atualizar suas próprias transações
- ✅ DELETE: Usuários podem deletar suas próprias transações

### Dividend Table
- ✅ SELECT: Usuários podem ver seus próprios proventos
- ✅ INSERT: Usuários podem criar proventos para si mesmos
- ✅ UPDATE: Usuários podem atualizar seus próprios proventos
- ✅ DELETE: Usuários podem deletar seus próprios proventos

### PriceHistory Table
- ✅ SELECT: Usuários podem ver histórico de preços de seus ativos
- ✅ ALL: Usuários podem gerenciar histórico de preços de seus ativos

## Verificação

Após executar o script, você pode verificar se o RLS está habilitado:

```sql
-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('User', 'Asset', 'Transaction', 'Dividend', 'PriceHistory');

-- Ver todas as políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## Importante

⚠️ **Após habilitar RLS, nenhum dado será acessível via API pública até que as políticas sejam criadas.**

As políticas usam `auth.uid()` do Supabase Auth para identificar o usuário autenticado. Certifique-se de que:

1. O Supabase Auth está configurado
2. Os usuários estão autenticados quando acessam os dados
3. O `id` na tabela `User` corresponde ao `auth.uid()` do Supabase Auth

## Troubleshooting

Se você encontrar problemas:

1. **Verifique se as tabelas existem:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Verifique se o RLS está habilitado:**
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE schemaname = 'public';
   ```

3. **Veja as políticas ativas:**
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

4. **Teste uma query simples:**
   ```sql
   SELECT * FROM "Asset" LIMIT 1;
   ```

## Referências

- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)


