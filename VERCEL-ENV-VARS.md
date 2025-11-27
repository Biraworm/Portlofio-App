# Variáveis de Ambiente no Vercel

## ⚠️ IMPORTANTE: Configure as variáveis de ambiente

Após o deploy, você **DEVE** configurar as variáveis de ambiente no Vercel para que o Supabase funcione corretamente.

## Como configurar:

1. **Acesse o Dashboard do Vercel**
2. **Vá em seu projeto → Settings → Environment Variables**
3. **Adicione as seguintes variáveis:**

### Variáveis obrigatórias:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### Variáveis opcionais:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

4. **Selecione os ambientes** onde essas variáveis devem estar disponíveis:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Salve** e faça um **novo deploy**

## Onde encontrar as credenciais do Supabase:

1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings → API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Nota sobre o build:

As páginas agora são renderizadas dinamicamente (`force-dynamic`), então o build não tentará fazer prerender com Supabase. Isso resolve o erro "supabaseUrl is required" durante o build.

## Após configurar:

1. As variáveis estarão disponíveis em runtime
2. O Supabase funcionará corretamente
3. A autenticação funcionará normalmente

