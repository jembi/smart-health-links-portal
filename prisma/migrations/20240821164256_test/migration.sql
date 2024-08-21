-- CreateTable
CREATE TABLE "cas_item" (
    "hash" TEXT NOT NULL PRIMARY KEY,
    "content" BLOB NOT NULL,
    "ref_count" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "shlink_file" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shlinkId" TEXT NOT NULL,
    "content_type" TEXT NOT NULL DEFAULT 'application/json',
    "contentHash" TEXT,
    CONSTRAINT "shlink_file_contentHash_fkey" FOREIGN KEY ("contentHash") REFERENCES "cas_item" ("hash") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "shlink_file_shlinkId_fkey" FOREIGN KEY ("shlinkId") REFERENCES "shlink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shlink_access" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shlinkId" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "access_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shlink_access_shlinkId_fkey" FOREIGN KEY ("shlinkId") REFERENCES "shlink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shlink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passcode_failures_remaining" INTEGER NOT NULL DEFAULT 5,
    "config_passcode" TEXT,
    "config_exp" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "management_token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "shlink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "access_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "server_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint_url" TEXT NOT NULL,
    "config_key" TEXT NOT NULL,
    "config_client_id" TEXT NOT NULL,
    "config_client_secret" TEXT,
    "config_token_endpoint" TEXT NOT NULL,
    "config_refresh_token" TEXT,
    "refresh_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_token_response" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "shlink_endpoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shlinkId" TEXT NOT NULL,
    "server_config_id" TEXT NOT NULL,
    "url_path" TEXT NOT NULL,
    CONSTRAINT "shlink_endpoint_shlinkId_fkey" FOREIGN KEY ("shlinkId") REFERENCES "shlink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shlink_endpoint_server_config_id_fkey" FOREIGN KEY ("server_config_id") REFERENCES "server_config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "cas_item_hash_key" ON "cas_item"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "cas_item_content_key" ON "cas_item"("content");

-- CreateIndex
CREATE INDEX "idx_cas_item_hash" ON "cas_item"("hash");

-- CreateIndex
CREATE INDEX "idx_shlink_file_shlinkId" ON "shlink_file"("shlinkId");

-- CreateIndex
CREATE INDEX "idx_shlink_file_contentHash" ON "shlink_file"("contentHash");

-- CreateIndex
CREATE INDEX "idx_shlink_access_shlinkId" ON "shlink_access"("shlinkId");

-- CreateIndex
CREATE UNIQUE INDEX "shlink_id_key" ON "shlink"("id");

-- CreateIndex
CREATE INDEX "idx_shlink_id" ON "shlink"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_key" ON "user"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_id" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "server_config_id_key" ON "server_config"("id");

-- CreateIndex
CREATE INDEX "idx_server_config_id" ON "server_config"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shlink_endpoint_id_key" ON "shlink_endpoint"("id");

-- CreateIndex
CREATE INDEX "idx_shlink_endpoint_shlinkId" ON "shlink_endpoint"("shlinkId");

-- CreateIndex
CREATE INDEX "idx_shlink_endpoint_serverConfigID" ON "shlink_endpoint"("server_config_id");
