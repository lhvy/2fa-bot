/*
  Warnings:

  - The primary key for the `Code` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Code` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Guild_id_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Code" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "guildId" TEXT,
    CONSTRAINT "Code_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Code" ("guildId", "key", "name") SELECT "guildId", "key", "name" FROM "Code";
DROP TABLE "Code";
ALTER TABLE "new_Code" RENAME TO "Code";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
