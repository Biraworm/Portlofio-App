# ✅ CONFIGURAÇÃO EXATA DO VERCEL - COPIE E COLE

## 🎯 Configuração OBRIGATÓRIA no Dashboard

### Settings → General:

```
Root Directory: apps/frontend
Framework Preset: Next.js
Build Command: (VAZIO - apague tudo)
Output Directory: .next
Install Command: (VAZIO - apague tudo)
Node.js Version: 20.x (ou deixe padrão)
```

### ⚠️ IMPORTANTE:

1. **Root Directory DEVE ser exatamente**: `apps/frontend`
   - ✅ Correto: `apps/frontend`
   - ❌ Errado: `./apps/frontend`
   - ❌ Errado: `apps/frontend/`
   - ❌ Errado: (vazio)

2. **Build Command e Install Command DEVEM estar VAZIOS**
   - O `vercel.json` fornecerá os comandos
   - Se você preencher manualmente, o vercel.json será ignorado

3. **Output Directory DEVE ser**: `.next`
   - Não `apps/frontend/.next`
   - O Vercel já está em `apps/frontend` quando usa Root Directory

## 🔄 Após Configurar:

1. **Salve** todas as alterações
2. **Vá em**: Settings → Environment Variables
3. **Adicione**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Salve** novamente
5. **Vá em**: Deployments
6. **Clique nos 3 pontos** do último deployment
7. **Redeploy** (ou faça um novo commit)

## ✅ Verificação nos Logs:

Quando funcionar, você verá:
```
Detected Next.js version: 14.2.5
Running "cd apps/frontend && npm install..."
```

## 🚨 Se AINDA não funcionar:

1. **Delete o projeto completamente no Vercel**
2. **Crie um NOVO projeto**
3. **Na tela de criação, configure Root Directory como `apps/frontend`**
4. **NÃO preencha Build/Install commands**
5. **Conecte ao repositório**
6. **Adicione Environment Variables**
7. **Deploy**

