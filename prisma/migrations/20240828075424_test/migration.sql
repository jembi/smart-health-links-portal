/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `shlink_access` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_server_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint_url" TEXT NOT NULL,
    "config_key" TEXT,
    "config_client_id" TEXT,
    "config_client_secret" TEXT,
    "config_token_endpoint" TEXT,
    "config_refresh_token" TEXT,
    "refresh_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_token_response" TEXT
);
INSERT INTO "new_server_config" ("access_token_response", "config_client_id", "config_client_secret", "config_key", "config_refresh_token", "config_token_endpoint", "endpoint_url", "id", "refresh_time") SELECT "access_token_response", "config_client_id", "config_client_secret", "config_key", "config_refresh_token", "config_token_endpoint", "endpoint_url", "id", "refresh_time" FROM "server_config";
DROP TABLE "server_config";
ALTER TABLE "new_server_config" RENAME TO "server_config";
CREATE UNIQUE INDEX "server_config_id_key" ON "server_config"("id");
CREATE INDEX "idx_server_config_id" ON "server_config"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "shlink_access_id_key" ON "shlink_access"("id");
