-- CreateEnum
CREATE TYPE "PaperStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "papers" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "keywords" TEXT[],
    "track_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "status" "PaperStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_authors" (
    "id" UUID NOT NULL,
    "paper_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "affiliation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paper_authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_versions" (
    "id" UUID NOT NULL,
    "paper_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paper_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "papers_track_id_idx" ON "papers"("track_id");

-- CreateIndex
CREATE INDEX "papers_author_id_idx" ON "papers"("author_id");

-- CreateIndex
CREATE INDEX "paper_authors_paper_id_idx" ON "paper_authors"("paper_id");

-- CreateIndex
CREATE INDEX "paper_versions_paper_id_idx" ON "paper_versions"("paper_id");

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "papers_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "papers" ADD CONSTRAINT "papers_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_authors" ADD CONSTRAINT "paper_authors_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paper_versions" ADD CONSTRAINT "paper_versions_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
