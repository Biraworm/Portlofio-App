# 🚨 CORREÇÃO URGENTE - CONFIGURAÇÃO OBRIGATÓRIA

## O Problema Real

O Vercel verifica o `package.json` **ANTES** de aplicar o Root Directory. Ele precisa encontrar Next.js no package.json do diretório onde está executando.

## ✅ SOLUÇÃO: Configuração no Dashboard

### PASSO A PASSO OBRIGATÓRIO:

1. **Acesse**: https://vercel.com/dashboard → Seu Projeto → Settings → General

2. **Root Directory**: 
   - **VALOR**: `apps/frontend`
   - ⚠️ **NÃO deixe vazio**
   - ⚠️ **NÃO use `.`**

3. **Framework Preset**: 
   - Selecione **"Next.js"** manualmente
   - Ou deixe em **"Other"** se não aparecer

4. **Build Command**: 
   - **APAGUE TUDO** (deixe vazio)
   - O vercel.json vai fornecer o comando

5. **Output Directory**: 
   - **VALOR**: `.next`
   - ⚠️ **NÃO use `apps/frontend/.next`**

6. **Install Command**: 
   - **APAGUE TUDO** (deixe vazio)
   - O vercel.json vai fornecer o comando

7. **Salve** todas as alterações

8. **Vá em**: Settings → Environment Variables
   - Adicione `NEXT_PUBLIC_SUPABASE_URL`
   - Adicione `NEXT_PUBLIC_SUPABASE_ANON_KEY`

9. **Faça um novo deploy**

## 🔍 Por que isso funciona?

Quando Root Directory = `apps/frontend`:
- Vercel muda para `apps/frontend` ANTES de verificar package.json
- Encontra Next.js em `apps/frontend/package.json`
- Executa build no diretório correto

## ⚠️ IMPORTANTE

Se você configurou Root Directory mas ainda está dando erro:
- **Verifique se salvou** as alterações
- **Verifique se o valor é exatamente** `apps/frontend` (sem barra no final)
- **Limpe o cache** e faça novo deploy

## 📸 Screenshot da Configuração Correta

```
Root Directory: apps/frontend
Framework Preset: Next.js
Build Command: (vazio)
Output Directory: .next
Install Command: (vazio)
```


