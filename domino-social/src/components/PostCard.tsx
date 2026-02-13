import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import type { WinnerSide } from "@prisma/client";

function winnerLabel(winner: WinnerSide, teamA: string, teamB: string) {
  if (winner === "A") return `${teamA} won`;
  if (winner === "B") return `${teamB} won`;
  return "Tie";
}

export default function PostCard({
  post,
  liked,
}: {
  post: {
    id: string;
    createdAt: Date;
    notes: string | null;
    author: { username: string; displayName: string };
    match: {
      teamAName: string;
      teamBName: string;
      scoreA: number;
      scoreB: number;
      winningScore: number;
      winner: WinnerSide;
      playedAt: Date;
    } | null;
    _count: { likes: number; comments: number };
  };
  liked: boolean;
}) {
  return (
    <article className="rounded-xl border border-emerald-400/15 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <Link
              href={`/u/${post.author.username}`}
              className="truncate font-medium text-white"
            >
              {post.author.displayName}
            </Link>
            <span className="truncate text-sm text-slate-300">@{post.author.username}</span>
          </div>
          <div className="mt-1 text-xs text-slate-300">
            <time dateTime={post.createdAt.toISOString()}>
              {post.createdAt.toLocaleString()}
            </time>
          </div>
        </div>

        <Link
          href={`/p/${post.id}`}
          className="shrink-0 text-sm text-slate-200 hover:text-white"
        >
          Open
        </Link>
      </div>

      {post.match ? (
        <div className="mt-4 rounded-lg border border-amber-400/15 bg-slate-950/40 p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="font-medium text-slate-100">
              {post.match.teamAName} {post.match.scoreA} – {post.match.scoreB} {post.match.teamBName}
            </div>
            <div className="text-slate-300">Race to {post.match.winningScore}</div>
          </div>
          <div className="mt-1 text-xs text-amber-200">
            {winnerLabel(post.match.winner, post.match.teamAName, post.match.teamBName)}
          </div>
        </div>
      ) : null}

      {post.notes ? <p className="mt-3 whitespace-pre-wrap text-slate-200">{post.notes}</p> : null}

      <div className="mt-4 flex items-center justify-between">
        <LikeButton postId={post.id} liked={liked} likeCount={post._count.likes} />
        <Link href={`/p/${post.id}`} className="text-sm text-slate-300 hover:text-white">
          Comments · {post._count.comments}
        </Link>
      </div>
    </article>
  );
}
