import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import CommentForm from "@/components/CommentForm";
import DeleteCommentButton from "@/components/DeleteCommentButton";
import DeletePostButton from "@/components/DeletePostButton";
import LikeButton from "@/components/LikeButton";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { WinnerSide } from "@prisma/client";

export const runtime = "nodejs";

function winnerLabel(winner: WinnerSide, teamA: string, teamB: string) {
  if (winner === "A") return `${teamA} won`;
  if (winner === "B") return `${teamB} won`;
  return "Tie";
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const current = await getCurrentUser();
  if (!current) redirect("/login");

  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: { id: true, username: true, displayName: true } },
      match: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, username: true, displayName: true } } },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) notFound();

  const liked = Boolean(
    await prisma.like.findUnique({
      where: { userId_postId: { userId: current.id, postId: post.id } },
      select: { userId: true },
    }),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-slate-200 hover:text-amber-100">
          ← Back
        </Link>
        {post.author.id === current.id ? <DeletePostButton postId={post.id} /> : null}
      </div>

      <article className="rounded-xl border border-emerald-400/15 bg-black/20 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href={`/u/${post.author.username}`} className="font-medium text-white">
              {post.author.displayName}
            </Link>
            <div className="mt-1 text-sm text-slate-300">@{post.author.username}</div>
            <div className="mt-1 text-xs text-slate-300">
              <time dateTime={post.createdAt.toISOString()}>{post.createdAt.toLocaleString()}</time>
            </div>
          </div>
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
              {winnerLabel(post.match.winner, post.match.teamAName, post.match.teamBName)} · You were Team {post.match.authorSide}
            </div>
          </div>
        ) : null}

        {post.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.photoUrl}
            alt="Match photo"
            className="mt-4 w-full rounded-lg border border-emerald-400/15 object-cover"
          />
        ) : null}

        {post.notes ? <p className="mt-4 whitespace-pre-wrap text-slate-200">{post.notes}</p> : null}

        <div className="mt-4 flex items-center justify-between">
          <LikeButton postId={post.id} liked={liked} likeCount={post._count.likes} />
          <div className="text-sm text-slate-300">Comments · {post._count.comments}</div>
        </div>
      </article>

      <section className="rounded-xl border border-emerald-400/15 bg-black/20 p-4">
        <h2 className="text-lg font-semibold">Comments</h2>
        <div className="mt-3">
          <CommentForm postId={post.id} />
        </div>

        <div className="mt-6 space-y-3">
          {post.comments.length === 0 ? (
            <div className="text-sm text-slate-300">No comments yet.</div>
          ) : (
            post.comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-emerald-400/15 bg-slate-950/40 p-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/u/${c.author.username}`} className="text-sm font-medium text-white">
                      {c.author.displayName}
                    </Link>
                    <span className="ml-2 text-xs text-slate-300">@{c.author.username}</span>
                    <div className="mt-1 whitespace-pre-wrap text-sm text-slate-200">{c.body}</div>
                    <div className="mt-2 text-xs text-slate-300">
                      <time dateTime={c.createdAt.toISOString()}>{c.createdAt.toLocaleString()}</time>
                    </div>
                  </div>

                  {c.author.id === current.id ? <DeleteCommentButton commentId={c.id} /> : null}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
