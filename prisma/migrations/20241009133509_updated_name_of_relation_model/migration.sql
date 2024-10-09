/*
  Warnings:

  - You are about to drop the `UserGenres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserGenres";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserFavoriteGenres" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "genderId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserFavoriteGenres_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserFavoriteGenres_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Genres" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
