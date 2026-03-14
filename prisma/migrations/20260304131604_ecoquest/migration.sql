/*
  Warnings:

  - The `category` column on the `Badge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `color` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `component` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Province` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `Province` table. All the data in the column will be lost.
  - You are about to drop the column `illustration` on the `Province` table. All the data in the column will be lost.
  - The `threatLevel` column on the `Province` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Leaderboard` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `rarity` on the `Badge` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `pointsReward` to the `Mission` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Mission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `difficulty` on the `Mission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `category` to the `Mission` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `region` on the `Province` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('CALCULATOR', 'DRAG_DROP', 'QUIZ', 'SIMULATION', 'GAME');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MissionCategory" AS ENUM ('OCEAN', 'TRANSPORT', 'WATER', 'COASTAL', 'BIODIVERSITY', 'WASTE', 'CLIMATE');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'CHALLENGER');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('SUMATERA', 'JAWA', 'KALIMANTAN', 'SULAWESI', 'PAPUA', 'BALI_NUSA_TENGGARA', 'MALUKU');

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_userId_fkey";

-- AlterTable
ALTER TABLE "Badge" DROP COLUMN "rarity",
ADD COLUMN     "rarity" "Rarity" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "MissionCategory";

-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "color",
DROP COLUMN "component",
ADD COLUMN     "pointsReward" INTEGER NOT NULL,
ADD COLUMN     "status" "MissionStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "type",
ADD COLUMN     "type" "MissionType" NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "MissionCategory" NOT NULL;

-- AlterTable
ALTER TABLE "Province" DROP COLUMN "color",
DROP COLUMN "coordinates",
DROP COLUMN "illustration",
DROP COLUMN "region",
ADD COLUMN     "region" "Region" NOT NULL,
DROP COLUMN "threatLevel",
ADD COLUMN     "threatLevel" "Difficulty";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "Leaderboard";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
