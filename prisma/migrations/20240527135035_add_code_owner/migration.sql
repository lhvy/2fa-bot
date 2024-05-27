/*
  Warnings:

  - Added the required column `owner` to the `Code` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Code" (
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    PRIMARY KEY ("guildId", "name"),
    CONSTRAINT "Code_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Code" ("guildId", "key", "name") SELECT "guildId", "key", "name" FROM "Code";
DROP TABLE "Code";
ALTER TABLE "new_Code" RENAME TO "Code";
PRAGMA foreign_key_check("Code");
PRAGMA foreign_keys=ON;
