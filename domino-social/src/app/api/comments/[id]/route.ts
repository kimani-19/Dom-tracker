import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  void req;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (comment.authorId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}
