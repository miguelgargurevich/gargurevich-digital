-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RenewalPlan" AS ENUM ('MONTHLY', 'ANNUAL_10', 'ANNUAL_15');

-- CreateTable
CREATE TABLE "ClientSite" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "setupFeePaidAt" TIMESTAMP(3),
    "subscriptionStartsAt" TIMESTAMP(3),
    "subscriptionEndsAt" TIMESTAMP(3),
    "graceIncludedMonths" INTEGER NOT NULL DEFAULT 12,
    "deactivatedAt" TIMESTAMP(3),
    "deactivationReason" TEXT,
    "lastRenewalPlan" "RenewalPlan",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionRenewal" (
    "id" TEXT NOT NULL,
    "clientSiteId" TEXT NOT NULL,
    "plan" "RenewalPlan" NOT NULL,
    "discountPercent" INTEGER NOT NULL DEFAULT 0,
    "amount" DECIMAL(10,2),
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionRenewal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientSite_slug_key" ON "ClientSite"("slug");

-- CreateIndex
CREATE INDEX "ClientSite_status_subscriptionEndsAt_idx" ON "ClientSite"("status", "subscriptionEndsAt");

-- CreateIndex
CREATE INDEX "SubscriptionRenewal_clientSiteId_startsAt_idx" ON "SubscriptionRenewal"("clientSiteId", "startsAt");

-- AddForeignKey
ALTER TABLE "SubscriptionRenewal" ADD CONSTRAINT "SubscriptionRenewal_clientSiteId_fkey" FOREIGN KEY ("clientSiteId") REFERENCES "ClientSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
