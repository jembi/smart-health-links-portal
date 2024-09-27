-- CreateTable
CREATE TABLE "cas_item" (
    "id" VARCHAR(43) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hash" VARCHAR(32) NOT NULL,
    "content" BYTEA NOT NULL,
    "ref_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cas_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shlink_file" (
    "id" VARCHAR(43) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shlink_id" TEXT NOT NULL,
    "content_type" TEXT NOT NULL DEFAULT 'application/json',
    "content_hash" TEXT,

    CONSTRAINT "shlink_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shlink_access" (
    "id" VARCHAR(43) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shlink_id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "access_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shlink_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shlink" (
    "id" VARCHAR(43) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "passcode_failures_remaining" INTEGER NOT NULL DEFAULT 5,
    "config_passcode" TEXT,
    "config_passcode_hash" TEXT,
    "config_exp" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "management_token" VARCHAR(43) NOT NULL,
    "user_id" VARCHAR(43) NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'nameless shlink',

    CONSTRAINT "shlink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR(43) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "server_config_id" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server_config" (
    "id" VARCHAR(43) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endpoint_url" TEXT NOT NULL,
    "config_key" VARCHAR(43),
    "config_client_id" TEXT,
    "config_client_secret" TEXT,
    "config_client_secret_hash" TEXT,
    "config_token_endpoint" TEXT,
    "config_refresh_token" TEXT,
    "refresh_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_token_response" TEXT NOT NULL,

    CONSTRAINT "server_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shlink_endpoint" (
    "id" VARCHAR(43) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shlink_id" TEXT NOT NULL,
    "server_config_id" TEXT NOT NULL,
    "url_path" VARCHAR(43) NOT NULL,

    CONSTRAINT "shlink_endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_ticket" (
    "id" VARCHAR(43) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shlink_id" TEXT NOT NULL,

    CONSTRAINT "access_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cas_item_id_key" ON "cas_item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cas_item_hash_key" ON "cas_item"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "cas_item_content_key" ON "cas_item"("content");

-- CreateIndex
CREATE INDEX "idx_cas_item_hash" ON "cas_item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shlink_file_id_key" ON "shlink_file"("id");

-- CreateIndex
CREATE INDEX "idx_shlink_file_shlinkId" ON "shlink_file"("shlink_id");

-- CreateIndex
CREATE INDEX "idx_shlink_file_content_hash" ON "shlink_file"("content_hash");

-- CreateIndex
CREATE INDEX "idx_shlink_access_shlinkId" ON "shlink_access"("shlink_id");

-- CreateIndex
CREATE UNIQUE INDEX "shlink_id_key" ON "shlink"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shlink_management_token_key" ON "shlink"("management_token");

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
CREATE INDEX "idx_shlink_endpoint_shlinkId" ON "shlink_endpoint"("shlink_id");

-- CreateIndex
CREATE INDEX "idx_shlink_endpoint_serverConfigID" ON "shlink_endpoint"("server_config_id");

-- CreateIndex
CREATE INDEX "idx_access_ticket_id" ON "access_ticket"("id");

-- AddForeignKey
ALTER TABLE "shlink_file" ADD CONSTRAINT "shlink_file_content_hash_fkey" FOREIGN KEY ("content_hash") REFERENCES "cas_item"("hash") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shlink_file" ADD CONSTRAINT "shlink_file_shlink_id_fkey" FOREIGN KEY ("shlink_id") REFERENCES "shlink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shlink_access" ADD CONSTRAINT "shlink_access_shlink_id_fkey" FOREIGN KEY ("shlink_id") REFERENCES "shlink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shlink" ADD CONSTRAINT "shlink_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_server_config_id_fkey" FOREIGN KEY ("server_config_id") REFERENCES "server_config"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shlink_endpoint" ADD CONSTRAINT "shlink_endpoint_shlink_id_fkey" FOREIGN KEY ("shlink_id") REFERENCES "shlink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shlink_endpoint" ADD CONSTRAINT "shlink_endpoint_server_config_id_fkey" FOREIGN KEY ("server_config_id") REFERENCES "server_config"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_ticket" ADD CONSTRAINT "access_ticket_shlink_id_fkey" FOREIGN KEY ("shlink_id") REFERENCES "shlink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
