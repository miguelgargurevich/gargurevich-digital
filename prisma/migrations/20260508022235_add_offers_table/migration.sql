-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "planKey" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'zap',
    "nameEs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "priceNoteEs" TEXT NOT NULL,
    "priceNoteEn" TEXT NOT NULL,
    "descriptionEs" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "itemsEs" TEXT[],
    "itemsEn" TEXT[],
    "ctaEs" TEXT NOT NULL DEFAULT 'Quiero este plan',
    "ctaEn" TEXT NOT NULL DEFAULT 'I want this plan',
    "forWhoEs" TEXT NOT NULL,
    "forWhoEn" TEXT NOT NULL,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Offer_planKey_key" ON "Offer"("planKey");
