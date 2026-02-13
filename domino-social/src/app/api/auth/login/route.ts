import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createSession,
  makeSessionCookieOptions,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/lib/auth";
import { validatePassword, validateUsername } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const usernameResult = validateUsername(body.username ?? "");
  if (!usernameResult.ok) {
    return NextResponse.json({ error: usernameResult.message }, { status: 400 });
  }

  const passwordResult = validatePassword(body.password ?? "");
  if (!passwordResult.ok) {
    return NextResponse.json({ error: passwordResult.message }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username: usernameResult.username } });
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const ok = await verifyPassword(body.password!, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const session = await createSession(user.id);
  const res = NextResponse.json(
    { user: { id: user.id, username: user.username, displayName: user.displayName } },
    { status: 200 },
  );
  res.cookies.set(SESSION_COOKIE_NAME, session.token, makeSessionCookieOptions(session.expiresAt));
  return res;
}
