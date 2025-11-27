# Correção do Erro no Vercel

## Problema Identificado

O Vercel está tentando clonar o repositório errado:
- ❌ Repositório atual: `github.com/Biraworm/frontend`
- ✅ Repositório correto: `github.com/Biraworm/Portlofio-App`

## Solução

### No Dashboard do Vercel:

1. **Acesse o projeto no Vercel Dashboard**
2. **Vá em Settings → General**
3. **Verifique/Corrija:**
   - **Repository**: Deve ser `Biraworm/Portlofio-App` (não `Biraworm/frontend`)
   - **Root Directory**: Deve ser `apps/frontend`
4. **Salve as alterações**
5. **Faça um novo deploy**

### Ou crie um novo projeto:

1. **Delete o projeto atual** (se for o errado)
2. **Crie um novo projeto**
3. **Conecte ao repositório correto**: `Biraworm/Portlofio-App`
4. **Configure:**
   - Root Directory: `apps/frontend`
   - Framework: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`

## Verificação

Após corrigir, o Vercel deve:
- ✅ Clonar: `github.com/Biraworm/Portlofio-App`
- ✅ Encontrar o diretório: `apps/frontend`
- ✅ Detectar Next.js corretamente

