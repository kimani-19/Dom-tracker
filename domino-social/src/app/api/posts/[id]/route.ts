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

  const { id: postId } = await context.params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { match: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (post.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.$transaction(async (tx) => {
    if (post.match) {
      const pointsScored = post.match.authorSide === "A" ? post.match.scoreA : post.match.scoreB;
      const win = post.match.winner !== "TIE" && post.match.winner === post.match.authorSide;
      const loss = post.match.winner !== "TIE" && post.match.winner !== post.match.authorSide;

      await tx.user.update({
        where: { id: user.id },
        data: {
          gamesPlayed: { decrement: 1 },
          wins: win ? { decrement: 1 } : undefined,
          losses: loss ? { decrement: 1 } : undefined,
          totalPoints: { decrement: pointsScored },
        },
      });
    }

    await tx.post.delete({ where: { id: postId } });
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
