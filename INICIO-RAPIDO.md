# 🚀 Início Rápido - Portfolio App

## ⚡ Comando Único (Mais Fácil)

```bash
npm run start:simple
```

Este comando:
- ✅ Verifica se o backend está rodando
- ✅ Se não estiver, inicia automaticamente
- ✅ Inicia o frontend
- ✅ Tudo em um único comando!

## 📱 Acessar

Após executar o comando acima:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

## 🔐 Login

- **Email**: `test@example.com`
- **Senha**: `test123456`

## 🛑 Parar

Pressione `Ctrl+C` no terminal ou execute:
```bash
npm run stop
```

## 🔧 Outras Opções

### Iniciar tudo manualmente
```bash
npm run start
```

### Iniciar apenas frontend (backend deve estar rodando)
```bash
cd apps/frontend
npm run dev:only
```

### Iniciar apenas backend
```bash
cd apps/backend
npm run start:dev
```

## ❓ Problemas?

Se o backend não iniciar automaticamente:
1. Execute manualmente: `cd apps/backend && npm run start:dev`
2. Aguarde alguns segundos
3. Recarregue o frontend

