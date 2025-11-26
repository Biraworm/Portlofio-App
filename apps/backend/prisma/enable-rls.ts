import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function enableRLS() {
  console.log('Enabling Row Level Security on all tables...');

  try {
    // Enable RLS on all tables
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Asset" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Dividend" ENABLE ROW LEVEL SECURITY;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "PriceHistory" ENABLE ROW LEVEL SECURITY;`);

    console.log('✅ RLS enabled on all tables');

    // Drop existing policies if they exist
    console.log('Dropping existing policies...');
    const tables = ['User', 'Asset', 'Transaction', 'Dividend', 'PriceHistory'];
    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can view their own ${table.toLowerCase()}" ON "${table}";`);
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can insert their own ${table.toLowerCase()}" ON "${table}";`);
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can update their own ${table.toLowerCase()}" ON "${table}";`);
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can delete their own ${table.toLowerCase()}" ON "${table}";`);
      } catch (e) {
        // Ignore errors if policies don't exist
      }
    }

    // Create policies for User table
    console.log('Creating policies for User table...');
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can view their own profile"
      ON "User"
      FOR SELECT
      TO authenticated
      USING (auth.uid()::text = id);
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can update their own profile"
      ON "User"
      FOR UPDATE
      TO authenticated
      USING (auth.uid()::text = id)
      WITH CHECK (auth.uid()::text = id);
    `);

    // Create policies for Asset table
    console.log('Creating policies for Asset table...');
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can view their own assets"
      ON "Asset"
      FOR SELECT
      TO authenticated
      USING (auth.uid()::text = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can insert their own assets"
      ON "Asset"
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid()::text = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can update their own assets"
      ON "Asset"
      FOR UPDATE
      TO authenticated
      USING (auth.uid()::text = "userId")
      WITH CHECK (auth.uid()::text = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can delete their own assets"
      ON "Asset"
      FOR DELETE
      TO authenticated
      USING (auth.uid()::text = "userId");
    `);

    // Create policies for Transaction table
    console.log('Creating policies for Transaction table...');
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can view their own transactions"
      ON "Transaction"
      FOR SELECT
      TO authenticated
      USING (auth.uid()::text = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can insert their own transactions"
      ON "Transaction"
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid()::text = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can update their own transactions"
      ON "Transaction"
      FOR UPDATE
      TO authenticated
      USING (auth.uid()::text = "userId")
      WITH CHECK (auth.uid()::text = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can delete their own transactions"
      ON "Transaction"
      FOR DELETE
      TO authenticated
      USING (auth.uid()::text = "userId");
    `);

    // Create policies for Dividend table
    console.log('Creating policies for Dividend table...');
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can view their own dividends"
      ON "Dividend"
      FOR SELECT
      TO authenticated
      USING (auth.uid()::text = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can insert their own dividends"
      ON "Dividend"
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid()::text = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can update their own dividends"
      ON "Dividend"
      FOR UPDATE
      TO authenticated
      USING (auth.uid()::text = "userId")
      WITH CHECK (auth.uid()::text = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can delete their own dividends"
      ON "Dividend"
      FOR DELETE
      TO authenticated
      USING (auth.uid()::text = "userId");
    `);

    // Create policies for PriceHistory table
    console.log('Creating policies for PriceHistory table...');
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can view price history for their assets"
      ON "PriceHistory"
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM "Asset"
          WHERE "Asset".id = "PriceHistory"."assetId"
          AND "Asset"."userId" = auth.uid()::text
        )
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can manage price history for their assets"
      ON "PriceHistory"
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM "Asset"
          WHERE "Asset".id = "PriceHistory"."assetId"
          AND "Asset"."userId" = auth.uid()::text
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM "Asset"
          WHERE "Asset".id = "PriceHistory"."assetId"
          AND "Asset"."userId" = auth.uid()::text
        )
      );
    `);

    console.log('✅ All RLS policies created successfully!');
  } catch (error) {
    console.error('❌ Error enabling RLS:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

enableRLS()
  .then(() => {
    console.log('✅ RLS setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ RLS setup failed:', error);
    process.exit(1);
  });

