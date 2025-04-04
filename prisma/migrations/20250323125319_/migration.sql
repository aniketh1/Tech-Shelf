/*
  Warnings:

  - You are about to drop the column `tags` on the `Articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "ArticleAnalytics" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "engagementRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleAnalytics_articleId_key" ON "ArticleAnalytics"("articleId");

-- AddForeignKey
ALTER TABLE "ArticleAnalytics" ADD CONSTRAINT "ArticleAnalytics_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
