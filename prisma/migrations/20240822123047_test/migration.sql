/*
  Warnings:

  - You are about to drop the column `content_hash` on the `shlink_file` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_shlink_file" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shlink_id" TEXT NOT NULL,
    "content_type" TEXT NOT NULL DEFAULT 'application/json',
    "content_id" TEXT,
    CONSTRAINT "shlink_file_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "cas_item" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "shlink_file_shlink_id_fkey" FOREIGN KEY ("shlink_id") REFERENCES "shlink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_shlink_file" ("content_type", "id", "shlink_id") SELECT "content_type", "id", "shlink_id" FROM "shlink_file";
DROP TABLE "shlink_file";
ALTER TABLE "new_shlink_file" RENAME TO "shlink_file";
CREATE UNIQUE INDEX "shlink_file_id_key" ON "shlink_file"("id");
CREATE INDEX "idx_shlink_file_shlinkId" ON "shlink_file"("shlink_id");
CREATE INDEX "idx_shlink_file_content_id" ON "shlink_file"("content_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
