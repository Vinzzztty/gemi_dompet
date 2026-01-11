-- Migration to fix null nama values in IncomeTransaction table
-- This updates all income transactions that have NULL nama field
-- by setting them to the category name as a default value

-- Update null nama with category name
UPDATE "IncomeTransaction" 
SET nama = (
  SELECT name 
  FROM "Category" 
  WHERE "Category".id = "IncomeTransaction"."categoryId"
)
WHERE nama IS NULL;

-- Alternative: If you prefer a generic default instead
-- UPDATE "IncomeTransaction" 
-- SET nama = 'Pemasukan' 
-- WHERE nama IS NULL;
