/*
  Warnings:

  - A unique constraint covering the columns `[management_token]` on the table `shlink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shlink_management_token_key" ON "shlink"("management_token");
