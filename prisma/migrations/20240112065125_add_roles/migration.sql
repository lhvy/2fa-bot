-- CreateTable
CREATE TABLE "Permission" (
    "roleId" TEXT NOT NULL,
    "codeGuildId" TEXT NOT NULL,
    "codeName" TEXT NOT NULL,

    PRIMARY KEY ("codeGuildId", "codeName", "roleId"),
    CONSTRAINT "Permission_codeGuildId_codeName_fkey" FOREIGN KEY ("codeGuildId", "codeName") REFERENCES "Code" ("guildId", "name") ON DELETE RESTRICT ON UPDATE CASCADE
);
