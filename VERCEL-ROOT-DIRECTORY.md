# ⚠️ CONFIGURAÇÃO CRÍTICA DO VERCEL

## Root Directory DEVE ser configurado

O erro "No Next.js version detected" ocorre porque o Vercel não está encontrando o `package.json` do Next.js.

## Solução: Configurar Root Directory no Vercel Dashboard

### Passo a passo:

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione seu projeto**
3. **Vá em**: Settings → General
4. **Encontre**: "Root Directory"
5. **Configure como**: `apps/frontend`
6. **Salve** as alterações
7. **Faça um novo deploy**

## Verificação

Após configurar, o Vercel deve:
- ✅ Encontrar `apps/frontend/package.json`
- ✅ Detectar Next.js 14.2.5
- ✅ Executar build corretamente

## Alternativa: Usar vercel.json

O arquivo `vercel.json` na raiz está configurado, mas o Vercel pode precisar que o Root Directory seja definido manualmente no dashboard também.

## Importante

**NÃO deixe o Root Directory vazio ou como `.` (raiz)**

O Root Directory **DEVE** ser: `apps/frontend`


