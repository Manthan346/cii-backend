-- AlterTable
ALTER TABLE "user" ALTER COLUMN "contact_no" SET DATA TYPE TEXT,
ALTER COLUMN "date_of_birth" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "candidates_details" (
    "candidate_id" SERIAL NOT NULL,
    "candidate_name" VARCHAR(100) NOT NULL,
    "contact_number" VARCHAR(10) NOT NULL,
    "email_id" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(10),
    "date_of_birth" DATE,
    "education" VARCHAR(100),

    CONSTRAINT "candidates_details_pkey" PRIMARY KEY ("candidate_id")
);

-- CreateTable
CREATE TABLE "staff_details" (
    "staff_id" SERIAL NOT NULL,
    "staff_name" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(50),

    CONSTRAINT "staff_details_pkey" PRIMARY KEY ("staff_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_details_contact_number_key" ON "candidates_details"("contact_number");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_details_email_id_key" ON "candidates_details"("email_id");
