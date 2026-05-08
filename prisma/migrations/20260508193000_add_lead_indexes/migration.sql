-- CreateIndex
CREATE INDEX "Lead_createdAt_id_idx" ON "Lead"("createdAt", "id");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_id_idx" ON "Lead"("status", "createdAt", "id");

-- CreateIndex
CREATE INDEX "Lead_name_id_idx" ON "Lead"("name", "id");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");
