import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

function getSqliteFilePath() {
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  if (!databaseUrl.startsWith("file:")) {
    throw new Error("This app is configured for SQLite only (DATABASE_URL must start with file:)");
  }

  const filePart = databaseUrl.slice("file:".length);
  if (!filePart) return path.join(process.cwd(), "dev.db");
  if (filePart.startsWith("./")) return path.join(process.cwd(), filePart.slice(2));
  if (path.isAbsolute(filePart)) return filePart;
  return path.join(process.cwd(), filePart);
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: getSqliteFilePath() }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
