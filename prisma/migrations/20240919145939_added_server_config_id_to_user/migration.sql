-- AlterTable
ALTER TABLE "user" ADD COLUMN     "server_config_id" TEXT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_server_config_id_fkey" FOREIGN KEY ("server_config_id") REFERENCES "server_config"("id") ON DELETE SET NULL ON UPDATE CASCADE;
