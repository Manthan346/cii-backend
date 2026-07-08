-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "candidate_name" TEXT NOT NULL,
    "contact_no" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "education" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
