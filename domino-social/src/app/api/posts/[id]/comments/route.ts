import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { validateCommentBody } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await context.params;
  const body = (await req.json().catch(() => null)) as { body?: string } | null;
  if (!body) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });

  const validated = validateCommentBody(body.body ?? "");
  if (!validated.ok) {
    return NextResponse.json({ error: validated.message }, { status: 400 });
  }

  const postExists = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
  if (!postExists) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId: user.id,
      body: validated.body,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: comment.id }, { status: 201 });
}
