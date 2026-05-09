-- AlterTable
ALTER TABLE "ClientSite"
ADD COLUMN "contractedService" TEXT,
ADD COLUMN "serviceTier" TEXT,
ADD COLUMN "setupFeeAmount" DECIMAL(10,2),
ADD COLUMN "recurringAmount" DECIMAL(10,2),
ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'PEN',
ADD COLUMN "billingEmail" TEXT,
ADD COLUMN "billingContactName" TEXT,
ADD COLUMN "billingContactPhone" TEXT,
ADD COLUMN "notes" TEXT;
