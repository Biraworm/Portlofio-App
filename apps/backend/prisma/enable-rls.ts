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
    await prisma.$executeRawUnsafe(`ALTER TABLE "Price" ENABLE ROW LEVEL SECURITY;`);

    console.log('✅ RLS enabled on all tables');

    // Drop existing policies if they exist
    console.log('Dropping existing policies...');
    const policies = [
      'Users can view their own profile',
      'Users can update their own profile',
      'Users can view their own assets',
      'Users can insert their own assets',
      'Users can update their own assets',
      'Users can delete their own assets',
      'Users can view their own transactions',
      'Users can insert their own transactions',
      'Users can update their own transactions',
      'Users can delete their own transactions',
      'Users can view their own dividends',
      'Users can insert their own dividends',
      'Users can update their own dividends',
      'Users can delete their own dividends',
      'Users can view prices for their assets',
      'Users can manage prices for their assets',
    ];

    for (const policyName of policies) {
      const tableName = policyName.includes('profile') ? 'User' :
                        policyName.includes('assets') && !policyName.includes('prices') ? 'Asset' :
                        policyName.includes('transactions') ? 'Transaction' :
                        policyName.includes('dividends') ? 'Dividend' :
                        'Price';
      try {
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "${policyName}" ON "${tableName}";`);
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
      USING (auth.uid() = id);
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can update their own profile"
      ON "User"
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
    `);

    // Create policies for Asset table
    console.log('Creating policies for Asset table...');
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can view their own assets"
      ON "Asset"
      FOR SELECT
      TO authenticated
      USING (auth.uid() = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can insert their own assets"
      ON "Asset"
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can update their own assets"
      ON "Asset"
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = "userId")
      WITH CHECK (auth.uid() = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can delete their own assets"
      ON "Asset"
      FOR DELETE
      TO authenticated
      USING (auth.uid() = "userId");
    `);

    // Create policies for Transaction table
    console.log('Creating policies for Transaction table...');
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can view their own transactions"
      ON "Transaction"
      FOR SELECT
      TO authenticated
      USING (auth.uid() = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can insert their own transactions"
      ON "Transaction"
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can update their own transactions"
      ON "Transaction"
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = "userId")
      WITH CHECK (auth.uid() = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can delete their own transactions"
      ON "Transaction"
      FOR DELETE
      TO authenticated
      USING (auth.uid() = "userId");
    `);

    // Create policies for Dividend table
    console.log('Creating policies for Dividend table...');
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can view their own dividends"
      ON "Dividend"
      FOR SELECT
      TO authenticated
      USING (auth.uid() = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can insert their own dividends"
      ON "Dividend"
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can update their own dividends"
      ON "Dividend"
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = "userId")
      WITH CHECK (auth.uid() = "userId");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can delete their own dividends"
      ON "Dividend"
      FOR DELETE
      TO authenticated
      USING (auth.uid() = "userId");
    `);

    // Create policies for Price table
    console.log('Creating policies for Price table...');
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can view prices for their assets"
      ON "Price"
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM "Asset"
          WHERE "Asset".id = "Price"."assetId"
          AND "Asset"."userId" = auth.uid()
        )
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Users can manage prices for their assets"
      ON "Price"
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM "Asset"
          WHERE "Asset".id = "Price"."assetId"
          AND "Asset"."userId" = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM "Asset"
          WHERE "Asset".id = "Price"."assetId"
          AND "Asset"."userId" = auth.uid()
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
