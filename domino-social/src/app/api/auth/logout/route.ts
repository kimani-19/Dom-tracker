import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSessionByToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  void req;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await deleteSessionByToken(token);
  }

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
