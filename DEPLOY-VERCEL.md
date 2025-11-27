# Como fazer Deploy no Vercel

## Opção 1: Usando Vercel CLI (Recomendado)

### Passo 1: Instalar Vercel CLI (se necessário)
```bash
npm install -g vercel
# ou use npx (não requer instalação global):
npx vercel
```

### Passo 2: Fazer login no Vercel
```bash
cd apps/frontend
npx vercel login
```

### Passo 3: Fazer deploy
```bash
# Ainda no diretório apps/frontend
npx vercel

# Para produção:
npx vercel --prod
```

### Passo 4: Configurar variáveis de ambiente
Após o primeiro deploy, configure as variáveis no dashboard do Vercel:
- Settings → Environment Variables
- Adicione:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_API_URL` (opcional, padrão: http://localhost:4000)

## Opção 2: Via Dashboard do Vercel (Mais fácil)

### Passo 1: Conectar repositório GitHub
1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New Project"
4. Selecione o repositório: `Biraworm/Portlofio-App`

### Passo 2: Configurar projeto
- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `apps/frontend` ⚠️ **IMPORTANTE**
- **Build Command**: `npm run build` (deixar padrão)
- **Output Directory**: `.next` (deixar padrão)
- **Install Command**: `npm install --legacy-peer-deps`

### Passo 3: Adicionar variáveis de ambiente
Antes de fazer deploy, adicione:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (se necessário)

### Passo 4: Deploy
Clique em "Deploy" e aguarde o processo.

## Verificações importantes

✅ Certifique-se de que o **Root Directory** está configurado como `apps/frontend`
✅ O arquivo `vercel.json` está na raiz do projeto
✅ Todas as dependências estão corretas no `package.json`

## Troubleshooting

Se ainda houver problemas:
1. Verifique o Root Directory nas configurações
2. Limpe o cache do build
3. Verifique os logs de build no Vercel

