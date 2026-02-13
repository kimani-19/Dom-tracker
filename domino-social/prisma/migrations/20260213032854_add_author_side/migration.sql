/*
  Warnings:

  - Added the required column `authorSide` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "teamAName" TEXT NOT NULL,
    "teamBName" TEXT NOT NULL,
    "authorSide" TEXT NOT NULL,
    "scoreA" INTEGER NOT NULL,
    "scoreB" INTEGER NOT NULL,
    "winningScore" INTEGER NOT NULL,
    "winner" TEXT NOT NULL,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Match_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("id", "playedAt", "postId", "scoreA", "scoreB", "teamAName", "teamBName", "winner", "winningScore") SELECT "id", "playedAt", "postId", "scoreA", "scoreB", "teamAName", "teamBName", "winner", "winningScore" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_postId_key" ON "Match"("postId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
