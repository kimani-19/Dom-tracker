import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  void req;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await context.params;

  await prisma.like.upsert({
    where: { userId_postId: { userId: user.id, postId } },
    create: { userId: user.id, postId },
    update: {},
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  void req;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await context.params;

  await prisma.like.deleteMany({ where: { userId: user.id, postId } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
