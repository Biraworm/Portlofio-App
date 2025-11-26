-- ============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================
-- Execute this script in Supabase SQL Editor or via psql

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Asset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Dividend" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PriceHistory" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP EXISTING POLICIES (if any)
-- ============================================

DROP POLICY IF EXISTS "Users can view their own profile" ON "User";
DROP POLICY IF EXISTS "Users can update their own profile" ON "User";
DROP POLICY IF EXISTS "Users can view their own assets" ON "Asset";
DROP POLICY IF EXISTS "Users can insert their own assets" ON "Asset";
DROP POLICY IF EXISTS "Users can update their own assets" ON "Asset";
DROP POLICY IF EXISTS "Users can delete their own assets" ON "Asset";
DROP POLICY IF EXISTS "Users can view their own transactions" ON "Transaction";
DROP POLICY IF EXISTS "Users can insert their own transactions" ON "Transaction";
DROP POLICY IF EXISTS "Users can update their own transactions" ON "Transaction";
DROP POLICY IF EXISTS "Users can delete their own transactions" ON "Transaction";
DROP POLICY IF EXISTS "Users can view their own dividends" ON "Dividend";
DROP POLICY IF EXISTS "Users can insert their own dividends" ON "Dividend";
DROP POLICY IF EXISTS "Users can update their own dividends" ON "Dividend";
DROP POLICY IF EXISTS "Users can delete their own dividends" ON "Dividend";
DROP POLICY IF EXISTS "Users can view price history for their assets" ON "PriceHistory";
DROP POLICY IF EXISTS "Users can manage price history for their assets" ON "PriceHistory";

-- ============================================
-- USER TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON "User"
FOR SELECT
TO authenticated
USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON "User"
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id)
WITH CHECK (auth.uid()::text = id);

-- ============================================
-- ASSET TABLE POLICIES
-- ============================================

-- Users can view their own assets
CREATE POLICY "Users can view their own assets"
ON "Asset"
FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Users can insert their own assets
CREATE POLICY "Users can insert their own assets"
ON "Asset"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own assets
CREATE POLICY "Users can update their own assets"
ON "Asset"
FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- Users can delete their own assets
CREATE POLICY "Users can delete their own assets"
ON "Asset"
FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- ============================================
-- TRANSACTION TABLE POLICIES
-- ============================================

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON "Transaction"
FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Users can insert their own transactions
CREATE POLICY "Users can insert their own transactions"
ON "Transaction"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own transactions
CREATE POLICY "Users can update their own transactions"
ON "Transaction"
FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- Users can delete their own transactions
CREATE POLICY "Users can delete their own transactions"
ON "Transaction"
FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- ============================================
-- DIVIDEND TABLE POLICIES
-- ============================================

-- Users can view their own dividends
CREATE POLICY "Users can view their own dividends"
ON "Dividend"
FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Users can insert their own dividends
CREATE POLICY "Users can insert their own dividends"
ON "Dividend"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own dividends
CREATE POLICY "Users can update their own dividends"
ON "Dividend"
FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId")
WITH CHECK (auth.uid()::text = "userId");

-- Users can delete their own dividends
CREATE POLICY "Users can delete their own dividends"
ON "Dividend"
FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- ============================================
-- PRICEHISTORY TABLE POLICIES
-- ============================================

-- Users can view price history for their own assets
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

-- Users can manage price history for their assets
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
