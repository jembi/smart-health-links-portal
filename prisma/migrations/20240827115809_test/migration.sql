/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `shlink_access` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "shlink_access_id_key" ON "shlink_access"("id");
