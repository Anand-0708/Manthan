-- CreateTable
CREATE TABLE "tracks" (
    "id" UUID NOT NULL,
    "conference_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tracks_conference_id_idx" ON "tracks"("conference_id");

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
