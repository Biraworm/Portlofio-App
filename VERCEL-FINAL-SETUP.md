# 🚀 Configuração Final do Vercel - PASSO A PASSO

## ⚠️ AÇÃO NECESSÁRIA NO DASHBOARD DO VERCEL

O erro "No Next.js version detected" ocorre porque o **Root Directory** não está configurado corretamente.

### SOLUÇÃO DEFINITIVA:

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione seu projeto** (ou crie um novo)
3. **Vá em**: Settings → General
4. **Role até**: "Root Directory"
5. **Configure como**: `apps/frontend` ⚠️ **OBRIGATÓRIO**
6. **Salve** as alterações
7. **Vá em**: Settings → Environment Variables
8. **Adicione**:
   - `NEXT_PUBLIC_SUPABASE_URL` = sua URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = sua chave
9. **Salve** novamente
10. **Faça um novo deploy**

## ✅ Verificações

Após configurar, verifique nos logs do deploy:

- ✅ "Found apps/frontend directory"
- ✅ "Checking Next.js version: next: 14.2.5"
- ✅ Build completa com sucesso

## 📋 Checklist de Configuração

- [ ] Root Directory = `apps/frontend`
- [ ] Framework = Next.js (auto-detectado)
- [ ] Build Command = `bash vercel-build.sh` (ou deixar padrão)
- [ ] Output Directory = `apps/frontend/.next` (ou `.next` se Root Directory estiver correto)
- [ ] Environment Variables configuradas
- [ ] Deploy realizado

## 🔧 Arquivos de Configuração

- ✅ `vercel.json` - Configuração do build
- ✅ `vercel-build.sh` - Script de build com detecção automática
- ✅ `package.json` (raiz) - Script `vercel-build` para fallback

## 💡 Dica

Se ainda houver problemas, **delete o projeto no Vercel** e crie um novo, garantindo que o Root Directory seja `apps/frontend` desde o início.


