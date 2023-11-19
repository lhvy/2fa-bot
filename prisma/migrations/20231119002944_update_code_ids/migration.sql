/*
  Warnings:

  - The primary key for the `Code` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Code` table. All the data in the column will be lost.
  - Made the column `guildId` on table `Code` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Code" (
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    PRIMARY KEY ("guildId", "name"),
    CONSTRAINT "Code_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Code" ("guildId", "key", "name") SELECT "guildId", "key", "name" FROM "Code";
DROP TABLE "Code";
ALTER TABLE "new_Code" RENAME TO "Code";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
