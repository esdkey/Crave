-- AlterTable
ALTER TABLE "Product" ADD COLUMN "salePrice" REAL;

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
