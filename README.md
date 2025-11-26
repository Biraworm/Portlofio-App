# Portfolio App

Monorepo contendo frontend e backend para aplicação de portfólio.

## Estrutura

```
portfolio-app/
├── apps/
│   ├── frontend/     # Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
│   └── backend/      # NestJS + TypeScript + Prisma
├── package.json
└── README.md
```

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## Instalação

```bash
npm run install:all
```

Ou instale cada workspace separadamente:

```bash
npm install
npm install --workspace=apps/frontend
npm install --workspace=apps/backend
```

## Desenvolvimento

### Rodar ambos (frontend + backend)

```bash
npm run dev
```

### Rodar apenas frontend

```bash
npm run dev:frontend
```

### Rodar apenas backend

```bash
npm run dev:backend
```

## Build

### Build de ambos

```bash
npm run build
```

### Build individual

```bash
npm run build:frontend
npm run build:backend
```

## Tecnologias

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- NestJS
- TypeScript
- Prisma

