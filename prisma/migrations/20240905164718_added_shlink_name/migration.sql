-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_shlink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passcode_failures_remaining" INTEGER NOT NULL DEFAULT 5,
    "config_passcode" TEXT,
    "config_exp" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "management_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'nameless shlink',
    CONSTRAINT "shlink_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_shlink" ("active", "config_exp", "config_passcode", "id", "management_token", "passcode_failures_remaining", "user_id") SELECT "active", "config_exp", "config_passcode", "id", "management_token", "passcode_failures_remaining", "user_id" FROM "shlink";
DROP TABLE "shlink";
ALTER TABLE "new_shlink" RENAME TO "shlink";
CREATE UNIQUE INDEX "shlink_id_key" ON "shlink"("id");
CREATE UNIQUE INDEX "shlink_management_token_key" ON "shlink"("management_token");
CREATE INDEX "idx_shlink_id" ON "shlink"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
