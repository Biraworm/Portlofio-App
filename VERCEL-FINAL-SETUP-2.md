# 🚀 Configuração Final do Vercel - GUIA DEFINITIVO

## ⚠️ IMPORTANTE: Configure exatamente assim no Vercel Dashboard

### 1. Settings → General

**Root Directory:** `apps/frontend` (exatamente assim, sem barras extras)

### 2. Settings → Build & Development Settings

**Build Command:** Deixe **VAZIO** (o `vercel.json` cuida disso)

**Output Directory:** `.next` (não `apps/frontend/.next`)

**Install Command:** Deixe **VAZIO** (o `vercel.json` cuida disso)

**Framework Preset:** Next.js

### 3. Environment Variables

Certifique-se de adicionar estas variáveis em **Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL` - Sua URL do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Sua chave anônima do Supabase

## ✅ O que foi corrigido:

1. ✅ Script de build melhorado para detectar o diretório correto
2. ✅ Cliente Supabase com tratamento de erros durante o build
3. ✅ `outputDirectory` corrigido para `.next` (relativo ao Root Directory)
4. ✅ Removido `output: 'standalone'` do `next.config.js`
5. ✅ Todas as páginas com `export const dynamic = 'force-dynamic'`

## 🔄 Próximos Passos:

1. Configure o Root Directory como `apps/frontend`
2. Deixe Build Command e Install Command **VAZIOS**
3. Configure Output Directory como `.next`
4. Adicione as variáveis de ambiente
5. Faça um novo deploy

## 📝 Notas:

- O script `vercel-build.sh` agora detecta automaticamente se já está no diretório correto
- Se o Root Directory estiver configurado, o Vercel já estará em `apps/frontend` quando executar o script
- O script funciona tanto com quanto sem Root Directory configurado


