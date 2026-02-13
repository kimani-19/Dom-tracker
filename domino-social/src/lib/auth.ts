import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE_NAME = "domino_session";

const SESSION_DAYS = 30;

export async function hashPassword(password: string) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function makeSessionCookieOptions(expiresAt: Date) {
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function deleteSessionByToken(token: string) {
  if (!token) return;
  await prisma.session.deleteMany({ where: { token } });
}

export async function getUserFromSessionToken(token: string) {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) {
    await deleteSessionByToken(token);
    return null;
  }

  return session.user;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return getUserFromSessionToken(token);
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
}
