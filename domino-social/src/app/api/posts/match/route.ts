import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clampInt } from "@/lib/validation";
import type { WinnerSide } from "@prisma/client";

export const runtime = "nodejs";

function computeWinner(scoreA: number, scoreB: number): WinnerSide {
  if (scoreA === scoreB) return "TIE";
  return scoreA > scoreB ? "A" : "B";
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | {
        teamAName?: string;
        teamBName?: string;
        authorSide?: "A" | "B";
        scoreA?: unknown;
        scoreB?: unknown;
        winningScore?: unknown;
        notes?: string | null;
        photoUrl?: string | null;
      }
    | null;

  if (!body) return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });

  const teamAName = (body.teamAName ?? "").trim() || "Team A";
  const teamBName = (body.teamBName ?? "").trim() || "Team B";
  const authorSide = body.authorSide === "B" ? "B" : "A";

  const scoreA = clampInt(body.scoreA, 0, 1000);
  const scoreB = clampInt(body.scoreB, 0, 1000);
  const winningScore = clampInt(body.winningScore, 1, 1000);

  if (scoreA === null || scoreB === null || winningScore === null) {
    return NextResponse.json({ error: "Scores must be valid numbers." }, { status: 400 });
  }

  const notes = (body.notes ?? "")?.trim();
  if (notes && notes.length > 1000) {
    return NextResponse.json({ error: "Notes are too long." }, { status: 400 });
  }

  const photoUrl = (body.photoUrl ?? "")?.trim();
  if (photoUrl && photoUrl.length > 2000) {
    return NextResponse.json({ error: "Photo URL is too long." }, { status: 400 });
  }

  const winner = computeWinner(scoreA, scoreB);

  const post = await prisma.$transaction(async (tx) => {
    const created = await tx.post.create({
      data: {
        authorId: user.id,
        notes: notes || null,
        photoUrl: photoUrl || null,
        type: "MATCH",
        match: {
          create: {
            teamAName,
            teamBName,
            authorSide,
            scoreA,
            scoreB,
            winningScore,
            winner,
          },
        },
      },
      select: { id: true },
    });

    const pointsScored = authorSide === "A" ? scoreA : scoreB;
    const win = winner !== "TIE" && winner === authorSide;
    const loss = winner !== "TIE" && winner !== authorSide;

    await tx.user.update({
      where: { id: user.id },
      data: {
        gamesPlayed: { increment: 1 },
        wins: win ? { increment: 1 } : undefined,
        losses: loss ? { increment: 1 } : undefined,
        totalPoints: { increment: pointsScored },
      },
    });

    return created;
  });

  return NextResponse.json({ postId: post.id }, { status: 201 });
}
