/*
  Warnings:

  - You are about to drop the `Genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieGenres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavoriteGenres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavoriteMovies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Genres";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MovieGenres";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserFavoriteGenres";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserFavoriteMovies";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Genders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_UserFavoriteGenders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserFavoriteGenders_A_fkey" FOREIGN KEY ("A") REFERENCES "Genders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserFavoriteGenders_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MovieGenders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MovieGenders_A_fkey" FOREIGN KEY ("A") REFERENCES "Genders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MovieGenders_B_fkey" FOREIGN KEY ("B") REFERENCES "Movies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UserFavoriteMovies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserFavoriteMovies_A_fkey" FOREIGN KEY ("A") REFERENCES "Movies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserFavoriteMovies_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Genders_name_key" ON "Genders"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavoriteGenders_AB_unique" ON "_UserFavoriteGenders"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavoriteGenders_B_index" ON "_UserFavoriteGenders"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieGenders_AB_unique" ON "_MovieGenders"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieGenders_B_index" ON "_MovieGenders"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavoriteMovies_AB_unique" ON "_UserFavoriteMovies"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavoriteMovies_B_index" ON "_UserFavoriteMovies"("B");
