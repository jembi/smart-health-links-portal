-- CreateTable
CREATE TABLE "access_ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shlink_id" TEXT NOT NULL,
    CONSTRAINT "access_ticket_shlink_id_fkey" FOREIGN KEY ("shlink_id") REFERENCES "shlink" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "idx_access_ticket_id" ON "access_ticket"("id");
