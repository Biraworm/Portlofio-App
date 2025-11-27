# 🔧 SOLUÇÃO DEFINITIVA: Erro "No Next.js version detected"

## ⚠️ O PROBLEMA

O Vercel verifica o `package.json` **ANTES** de aplicar o Root Directory. Isso causa o erro "No Next.js version detected".

## ✅ SOLUÇÃO: Configuração Correta no Dashboard

### Passo 1: Settings → General
**Root Directory:** `apps/frontend`

⚠️ **CRÍTICO:** O Root Directory DEVE estar configurado ANTES de qualquer build.

### Passo 2: Settings → Build & Development Settings

**Deixe TODOS os campos VAZIOS:**
- Build Command: **VAZIO**
- Output Directory: **VAZIO** (ou `.next` se não aceitar vazio)
- Install Command: **VAZIO**
- Framework Preset: **Next.js** (ou deixe vazio)

### Passo 3: Verificar vercel.json

O `vercel.json` na raiz do projeto deve ter:
```json
{
  "buildCommand": "npm install --legacy-peer-deps && npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs"
}
```

## 🔍 Como Funciona

1. Você configura Root Directory como `apps/frontend` no dashboard
2. O Vercel muda para `apps/frontend` ANTES de executar qualquer comando
3. O `vercel.json` é lido, mas os comandos são executados em `apps/frontend`
4. O `package.json` em `apps/frontend` contém Next.js
5. ✅ Build funciona!

## 🚨 Se Ainda Não Funcionar

### Opção 1: Remover vercel.json temporariamente
1. Renomeie `vercel.json` para `vercel.json.backup`
2. Configure no dashboard:
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`
3. Faça deploy

### Opção 2: Usar Override no Dashboard
Se o `vercel.json` não estiver sendo respeitado:
1. No dashboard, configure manualmente:
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`
2. Isso sobrescreve o `vercel.json`

## ✅ Checklist Final

- [ ] Root Directory configurado como `apps/frontend`
- [ ] Build Command configurado (no dashboard ou vercel.json)
- [ ] Output Directory configurado como `.next`
- [ ] Install Command configurado
- [ ] Environment Variables adicionadas (NEXT_PUBLIC_SUPABASE_URL, etc.)
- [ ] Framework Preset: Next.js

## 📝 Nota Importante

O Vercel aplica o Root Directory **ANTES** de ler o `vercel.json`. Portanto:
- Se Root Directory = `apps/frontend`
- E `vercel.json` tem `buildCommand: "npm run build"`
- O comando será executado em `apps/frontend`, não na raiz

Isso é o comportamento esperado e correto!


