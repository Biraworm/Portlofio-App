# 🚀 Correção do Build do Backend na Vercel

Identifiquei que o problema principal do timeout no build (excedendo 45 minutos) era provavelmente causado pela **falta do arquivo `package-lock.json`** no diretório `apps/backend`.

Sem esse arquivo, o comando `npm ci` (usado no script de install otimizado) falha ou o `npm install` tenta resolver todas as dependências do zero, o que pode demorar muito ou travar em ambientes de CI/CD como a Vercel, além de não garantir as versões exatas das dependências.

## ✅ Correções Aplicadas

1.  **Geração do `package-lock.json`**:
    - Executei `npm install --package-lock-only` dentro de `apps/backend`.
    - Isso garante que a Vercel possa instalar as dependências de forma rápida e determinística.

2.  **Definição da Versão do Node.js**:
    - Adicionei `"engines": { "node": ">=18" }` ao `package.json` do backend.
    - Isso garante que a Vercel use uma versão moderna e compatível do Node.js.

3.  **Verificação das Otimizações**:
    - Confirmei que o `tsconfig.json` e `nest-cli.json` já estão otimizados para remover source maps e declarações, reduzindo o tamanho do build.
    - O arquivo `.vercelignore` está configurado corretamente para ignorar arquivos desnecessários.

## 🛠 Configuração Necessária na Vercel

Para que o deploy funcione corretamente, certifique-se de que o projeto na Vercel esteja configurado da seguinte forma:

### 1. Root Directory
Vá em **Settings > General** e defina:
- **Root Directory**: `apps/backend`

### 2. Build & Development Settings
Vá em **Settings > Build & Development Settings** e configure:
- **Framework Preset**: `Other`
- **Build Command**: `npm run build:vercel:fast` (ou deixe vazio se o `vercel.json` estiver sendo lido corretamente)
- **Output Directory**: `dist`
- **Install Command**: `npm ci --legacy-peer-deps --prefer-offline --no-audit --silent --no-optional --no-fund --no-progress --ignore-scripts` (ou deixe vazio se o `vercel.json` estiver sendo lido corretamente)

### 3. Environment Variables
Certifique-se de que as variáveis de ambiente (como `DATABASE_URL`) estejam configuradas nas configurações do projeto na Vercel.

## ⚠️ Nota sobre NestJS na Vercel

A Vercel é otimizada para Frontend e Serverless Functions. O NestJS por padrão roda como um servidor HTTP contínuo (`app.listen()`).
Embora o build agora deva passar, para que a aplicação **rode** corretamente na Vercel (Serverless), pode ser necessário adaptar o `main.ts` para exportar uma função serverless ou usar um adaptador, caso você encontre erros de "Function timed out" ou 404 após o deploy.

Mas o primeiro passo era resolver o **Build Timeout**, que deve estar solucionado com o `package-lock.json`.
