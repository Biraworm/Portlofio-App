# Portfolio App Backend

Backend API built with NestJS, TypeScript, Prisma, and PostgreSQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens

3. Run Prisma migrations:
```bash
npm run migrate:dev
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Start development server:
```bash
npm run start:dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Assets
- `GET /assets` - List all assets (requires auth)
- `POST /assets` - Create new asset (requires auth)
- `GET /assets/:id` - Get asset by ID (requires auth)
- `DELETE /assets/:id` - Delete asset (requires auth)

### Transactions
- `GET /transactions` - List all transactions (requires auth)
- `POST /transactions` - Create new transaction (requires auth)
- `GET /transactions/:id` - Get transaction by ID (requires auth)

### Dividends
- `GET /dividends` - List all dividends (requires auth)
- `POST /dividends` - Create new dividend (requires auth)
- `GET /dividends/:id` - Get dividend by ID (requires auth)

### Portfolio
- `GET /portfolio` - Get portfolio summary (requires auth)
- `GET /portfolio/compare?index=SPX` - Compare portfolio with index (requires auth)

### Prices
- `POST /sync/prices` - Sync prices for all assets (requires auth)
- `GET /sync/prices/:ticker?days=30` - Get price history (requires auth)

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:cov
```

## Database

Prisma Studio (database GUI):
```bash
npm run prisma:studio
```

