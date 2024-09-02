/*
  Warnings:

  - The primary key for the `cas_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `shlink` table. All the data in the column will be lost.
  - You are about to drop the column `shlinkId` on the `shlink_access` table. All the data in the column will be lost.
  - You are about to drop the column `shlinkId` on the `shlink_endpoint` table. All the data in the column will be lost.
  - You are about to drop the column `contentHash` on the `shlink_file` table. All the data in the column will be lost.
  - You are about to drop the column `shlinkId` on the `shlink_file` table. All the data in the column will be lost.
  - You are about to drop the column `access_time` on the `user` table. All the data in the column will be lost.
  - The required column `id` was added to the `cas_item` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `user_id` to the `shlink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shlink_id` to the `shlink_access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shlink_id` to the `shlink_endpoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shlink_id` to the `shlink_file` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cas_item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hash" TEXT NOT NULL,
    "content" BLOB NOT NULL,
    "ref_count" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_cas_item" ("content", "hash", "ref_count") SELECT "content", "hash", "ref_count" FROM "cas_item";
DROP TABLE "cas_item";
ALTER TABLE "new_cas_item" RENAME TO "cas_item";
CREATE UNIQUE INDEX "cas_item_id_key" ON "cas_item"("id");
CREATE UNIQUE INDEX "cas_item_hash_key" ON "cas_item"("hash");
CREATE UNIQUE INDEX "cas_item_content_key" ON "cas_item"("content");
CREATE INDEX "idx_cas_item_hash" ON "cas_item"("id");
CREATE TABLE "new_server_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint_url" TEXT NOT NULL,
    "config_key" TEXT,
    "config_client_id" TEXT,
    "config_client_secret" TEXT,
    "config_token_endpoint" TEXT,
    "config_refresh_token" TEXT,
    "refresh_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_token_response" TEXT NOT NULL
);
INSERT INTO "new_server_config" ("access_token_response", "config_client_id", "config_client_secret", "config_key", "config_refresh_token", "config_token_endpoint", "endpoint_url", "id", "refresh_time") SELECT "access_token_response", "config_client_id", "config_client_secret", "config_key", "config_refresh_token", "config_token_endpoint", "endpoint_url", "id", "refresh_time" FROM "server_config";
DROP TABLE "server_config";
ALTER TABLE "new_server_config" RENAME TO "server_config";
CREATE UNIQUE INDEX "server_config_id_key" ON "server_config"("id");
CREATE INDEX "idx_server_config_id" ON "server_config"("id");
CREATE TABLE "new_shlink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passcode_failures_remaining" INTEGER NOT NULL DEFAULT 5,
    "config_passcode" TEXT,
    "config_exp" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "management_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "shlink_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_shlink" ("active", "config_exp", "config_passcode", "id", "management_token", "passcode_failures_remaining") SELECT "active", "config_exp", "config_passcode", "id", "management_token", "passcode_failures_remaining" FROM "shlink";
DROP TABLE "shlink";
ALTER TABLE "new_shlink" RENAME TO "shlink";
CREATE UNIQUE INDEX "shlink_id_key" ON "shlink"("id");
CREATE INDEX "idx_shlink_id" ON "shlink"("id");
CREATE TABLE "new_shlink_access" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shlink_id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "access_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shlink_access_shlink_id_fkey" FOREIGN KEY ("shlink_id") REFERENCES "shlink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_shlink_access" ("access_time", "id", "recipient") SELECT "access_time", "id", "recipient" FROM "shlink_access";
DROP TABLE "shlink_access";
ALTER TABLE "new_shlink_access" RENAME TO "shlink_access";
CREATE INDEX "idx_shlink_access_shlinkId" ON "shlink_access"("shlink_id");
CREATE TABLE "new_shlink_endpoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shlink_id" TEXT NOT NULL,
    "server_config_id" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    CONSTRAINT "shlink_endpoint_shlink_id_fkey" FOREIGN KEY ("shlink_id") REFERENCES "shlink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shlink_endpoint_server_config_id_fkey" FOREIGN KEY ("server_config_id") REFERENCES "server_config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_shlink_endpoint" ("id", "server_config_id", "url_path") SELECT "id", "server_config_id", "url_path" FROM "shlink_endpoint";
DROP TABLE "shlink_endpoint";
ALTER TABLE "new_shlink_endpoint" RENAME TO "shlink_endpoint";
CREATE UNIQUE INDEX "shlink_endpoint_id_key" ON "shlink_endpoint"("id");
CREATE INDEX "idx_shlink_endpoint_shlinkId" ON "shlink_endpoint"("shlink_id");
CREATE INDEX "idx_shlink_endpoint_serverConfigID" ON "shlink_endpoint"("server_config_id");
CREATE TABLE "new_shlink_file" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shlink_id" TEXT NOT NULL,
    "content_type" TEXT NOT NULL DEFAULT 'application/json',
    "content_hash" TEXT,
    CONSTRAINT "shlink_file_content_hash_fkey" FOREIGN KEY ("content_hash") REFERENCES "cas_item" ("hash") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "shlink_file_shlink_id_fkey" FOREIGN KEY ("shlink_id") REFERENCES "shlink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_shlink_file" ("content_type", "id") SELECT "content_type", "id" FROM "shlink_file";
DROP TABLE "shlink_file";
ALTER TABLE "new_shlink_file" RENAME TO "shlink_file";
CREATE UNIQUE INDEX "shlink_file_id_key" ON "shlink_file"("id");
CREATE INDEX "idx_shlink_file_shlinkId" ON "shlink_file"("shlink_id");
CREATE INDEX "idx_shlink_file_content_hash" ON "shlink_file"("content_hash");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL
);
INSERT INTO "new_user" ("id", "patient_id", "user_id") SELECT "id", "patient_id", "user_id" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_user_id_key" ON "user"("user_id");
CREATE INDEX "idx_user_id" ON "user"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
