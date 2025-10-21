/*
  Warnings:

  - You are about to drop the column `userId` on the `CVs` table. All the data in the column will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profileId` to the `CVs` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Create the new Profiles table
CREATE TABLE "Profiles" (
    "id" SERIAL NOT NULL,
    "profileName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "title" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "summary" TEXT,
    "skills" TEXT[],
    "links" JSONB[],
    "education" JSONB[],
    "experiences" JSONB[],
    "projects" JSONB[],
    "activities" JSONB[],
    "volunteering" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("id")
);

-- Step 2: Migrate data from Users to Profiles
-- Using email as profileName since it was unique in Users table
INSERT INTO "Profiles" (
    "id",
    "profileName",
    "email",
    "fullName",
    "title",
    "phone",
    "location",
    "summary",
    "skills",
    "links",
    "education",
    "experiences",
    "projects",
    "activities",
    "volunteering",
    "createdAt",
    "updatedAt"
)
SELECT 
    "id",
    "email" as "profileName",  -- Using email as profileName
    "email",
    "fullName",
    "title",
    "phone",
    "location",
    "summary",
    "skills",
    "links",
    "education",
    "experiences",
    "projects",
    "activities",
    "volunteering",
    "createdAt",
    "updatedAt"
FROM "Users";

-- Step 3: Add profileId column to CVs table
ALTER TABLE "CVs" ADD COLUMN "profileId" INTEGER;

-- Step 4: Populate profileId with userId values (since we kept the same IDs)
UPDATE "CVs" SET "profileId" = "userId";

-- Step 5: Make profileId NOT NULL now that it has values
ALTER TABLE "CVs" ALTER COLUMN "profileId" SET NOT NULL;

-- Step 6: Drop the foreign key constraint on userId
ALTER TABLE "CVs" DROP CONSTRAINT "CVs_userId_fkey";

-- Step 7: Drop the userId column
ALTER TABLE "CVs" DROP COLUMN "userId";

-- Step 8: Drop the Users table
DROP TABLE "Users";

-- Step 9: Create unique index on Profiles.profileName
CREATE UNIQUE INDEX "Profiles_profileName_key" ON "Profiles"("profileName");

-- Step 10: Add foreign key constraint for profileId
ALTER TABLE "CVs" ADD CONSTRAINT "CVs_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
