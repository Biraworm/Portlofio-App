# 🚨 LIMPEZA CRÍTICA DO DASHBOARD VERCEL

## ⚠️ PROBLEMA IDENTIFICADO

O dashboard do Vercel está **SOBRESCREVENDO** o `vercel.json`. O log mostra:
```
Running "npm install --legacy-peer-deps && npm run build"
```

Mas o `vercel.json` tem apenas `npm run build`. Isso significa que há uma configuração no dashboard que está sobrescrevendo.

## ✅ SOLUÇÃO: LIMPAR CONFIGURAÇÃO DO DASHBOARD

### Passo 1: Acesse o Dashboard
1. Vá em: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em: **Settings → Build & Development Settings**

### Passo 2: APAGUE TUDO (CRÍTICO)
**APAGUE COMPLETAMENTE** os seguintes campos:

- **Build Command:** APAGUE TUDO (deixe completamente vazio)
- **Install Command:** APAGUE TUDO (deixe completamente vazio)
- **Output Directory:** Deixe como `.next` (ou apague se aceitar vazio)
- **Framework Preset:** Next.js (ou deixe vazio)

### Passo 3: Verifique Root Directory
1. Vá em: **Settings → General**
2. **Root Directory:** Deve ser `apps/frontend`
3. Se não estiver, configure como `apps/frontend`

### Passo 4: Salve
1. Clique em **Save** em todas as páginas
2. Aguarde a confirmação

### Passo 5: Faça Novo Deploy
1. Vá em: **Deployments**
2. Clique nos **3 pontos** do último deployment
3. Clique em **Redeploy**

## 🔍 Verificação

Após limpar, nos logs você deve ver:
```
Running "install" command: npm install --legacy-peer-deps
...
Running "npm run build"
```

**NÃO deve aparecer:**
```
Running "npm install --legacy-peer-deps && npm run build"
```

## 📝 Por que isso é necessário?

Quando você preenche os campos no dashboard, o Vercel **IGNORA** o `vercel.json`. Por isso:
- O `buildCommand` do dashboard está executando `npm install && npm run build`
- Isso remove dependências instaladas no `installCommand`
- Resultado: `tailwindcss` e outros módulos não são encontrados

## ✅ Após Limpar

O `vercel.json` será usado automaticamente:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "outputDirectory": ".next"
}
```

Isso garante que:
- ✅ `installCommand` instala todas as dependências (502 pacotes)
- ✅ `buildCommand` apenas executa o build (sem remover dependências)
- ✅ Todos os módulos serão encontrados corretamente

