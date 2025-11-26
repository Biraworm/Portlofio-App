-- ============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================
-- Execute this script in Supabase SQL Editor or via psql

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Asset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Dividend" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Price" ENABLE ROW LEVEL SECURITY;

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
DROP POLICY IF EXISTS "Users can view prices for their assets" ON "Price";
DROP POLICY IF EXISTS "Users can manage prices for their assets" ON "Price";

-- ============================================
-- USER TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON "User"
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON "User"
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- ASSET TABLE POLICIES
-- ============================================

-- Users can view their own assets
CREATE POLICY "Users can view their own assets"
ON "Asset"
FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can insert their own assets
CREATE POLICY "Users can insert their own assets"
ON "Asset"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can update their own assets
CREATE POLICY "Users can update their own assets"
ON "Asset"
FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own assets
CREATE POLICY "Users can delete their own assets"
ON "Asset"
FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ============================================
-- TRANSACTION TABLE POLICIES
-- ============================================

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON "Transaction"
FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can insert their own transactions
CREATE POLICY "Users can insert their own transactions"
ON "Transaction"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can update their own transactions
CREATE POLICY "Users can update their own transactions"
ON "Transaction"
FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own transactions
CREATE POLICY "Users can delete their own transactions"
ON "Transaction"
FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ============================================
-- DIVIDEND TABLE POLICIES
-- ============================================

-- Users can view their own dividends
CREATE POLICY "Users can view their own dividends"
ON "Dividend"
FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Users can insert their own dividends
CREATE POLICY "Users can insert their own dividends"
ON "Dividend"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = "userId");

-- Users can update their own dividends
CREATE POLICY "Users can update their own dividends"
ON "Dividend"
FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (auth.uid() = "userId");

-- Users can delete their own dividends
CREATE POLICY "Users can delete their own dividends"
ON "Dividend"
FOR DELETE
TO authenticated
USING (auth.uid() = "userId");

-- ============================================
-- PRICE TABLE POLICIES
-- ============================================

-- Users can view prices for their own assets
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

-- Users can manage prices for their assets
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
