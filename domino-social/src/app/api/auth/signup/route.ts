import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, hashPassword, makeSessionCookieOptions, SESSION_COOKIE_NAME } from "@/lib/auth";
import { validateDisplayName, validatePassword, validateUsername } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { username?: string; password?: string; displayName?: string }
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

  const displayNameResult = validateDisplayName(body.displayName ?? usernameResult.username);
  if (!displayNameResult.ok) {
    return NextResponse.json({ error: displayNameResult.message }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username: usernameResult.username } });
  if (existing) {
    return NextResponse.json({ error: "Username already taken." }, { status: 409 });
  }

  const passwordHash = await hashPassword(body.password!);
  const user = await prisma.user.create({
    data: {
      username: usernameResult.username,
      displayName: displayNameResult.displayName,
      passwordHash,
    },
    select: { id: true, username: true, displayName: true },
  });

  const session = await createSession(user.id);

  const res = NextResponse.json({ user }, { status: 201 });
  res.cookies.set(SESSION_COOKIE_NAME, session.token, makeSessionCookieOptions(session.expiresAt));
  return res;
}
