-- CreateEnum
CREATE TYPE "ConferenceRoleType" AS ENUM ('AUTHOR', 'REVIEWER', 'CHAIR');

-- CreateEnum
CREATE TYPE "ReviewRecommendation" AS ENUM ('ACCEPT', 'MINOR_REVISION', 'MAJOR_REVISION', 'REJECT');

-- CreateTable
CREATE TABLE "conference_roles" (
    "id" UUID NOT NULL,
    "conference_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "ConferenceRoleType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conference_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_assignments" (
    "id" UUID NOT NULL,
    "paper_id" UUID NOT NULL,
    "reviewer_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "assignment_id" UUID NOT NULL,
    "reviewer_id" UUID NOT NULL,
    "paper_id" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "strengths" TEXT,
    "weaknesses" TEXT,
    "comments" TEXT,
    "recommendation" "ReviewRecommendation" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conference_roles_conference_id_idx" ON "conference_roles"("conference_id");

-- CreateIndex
CREATE INDEX "conference_roles_user_id_idx" ON "conference_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "conference_roles_conference_id_user_id_role_key" ON "conference_roles"("conference_id", "user_id", "role");

-- CreateIndex
CREATE INDEX "review_assignments_paper_id_idx" ON "review_assignments"("paper_id");

-- CreateIndex
CREATE INDEX "review_assignments_reviewer_id_idx" ON "review_assignments"("reviewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_assignments_paper_id_reviewer_id_key" ON "review_assignments"("paper_id", "reviewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_assignment_id_key" ON "reviews"("assignment_id");

-- CreateIndex
CREATE INDEX "reviews_reviewer_id_idx" ON "reviews"("reviewer_id");

-- CreateIndex
CREATE INDEX "reviews_paper_id_idx" ON "reviews"("paper_id");

-- AddForeignKey
ALTER TABLE "conference_roles" ADD CONSTRAINT "conference_roles_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conference_roles" ADD CONSTRAINT "conference_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_assignments" ADD CONSTRAINT "review_assignments_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_assignments" ADD CONSTRAINT "review_assignments_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "review_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
