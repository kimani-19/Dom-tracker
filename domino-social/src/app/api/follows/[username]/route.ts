import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizeUsername } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ username: string }> },
) {
  void req;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username } = await context.params;
  const targetUsername = normalizeUsername(username);

  const target = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (target.id === user.id) return NextResponse.json({ error: "Cannot follow yourself." }, { status: 400 });

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: user.id, followingId: target.id } },
    create: { followerId: user.id, followingId: target.id },
    update: {},
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ username: string }> },
) {
  void req;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username } = await context.params;
  const targetUsername = normalizeUsername(username);

  const target = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (target.id === user.id) return NextResponse.json({ error: "Cannot unfollow yourself." }, { status: 400 });

  await prisma.follow.deleteMany({ where: { followerId: user.id, followingId: target.id } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
