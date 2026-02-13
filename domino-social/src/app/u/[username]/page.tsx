import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FollowButton from "@/components/FollowButton";
import PostCard from "@/components/PostCard";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizeUsername } from "@/lib/validation";

export const runtime = "nodejs";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const current = await getCurrentUser();
  if (!current) redirect("/login");

  const { username } = await params;
  const targetUsername = normalizeUsername(username);

  const user = await prisma.user.findUnique({
    where: { username: targetUsername },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      gamesPlayed: true,
      wins: true,
      losses: true,
      totalPoints: true,
      createdAt: true,
      _count: { select: { followers: true, following: true, posts: true } },
    },
  });

  if (!user) notFound();

  const following =
    user.id === current.id
      ? false
      : Boolean(
          await prisma.follow.findUnique({
            where: { followerId_followingId: { followerId: current.id, followingId: user.id } },
            select: { followerId: true },
          }),
        );

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { username: true, displayName: true } },
      match: true,
      _count: { select: { likes: true, comments: true } },
    },
  });

  const liked = await prisma.like.findMany({
    where: { userId: current.id, postId: { in: posts.map((p) => p.id) } },
    select: { postId: true },
  });
  const likedSet = new Set(liked.map((l) => l.postId));

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-emerald-400/15 bg-black/20 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight">{user.displayName}</h1>
            <div className="mt-1 text-sm text-slate-300">@{user.username}</div>
            {user.bio ? <p className="mt-3 text-slate-200">{user.bio}</p> : null}
          </div>

          {user.id === current.id ? (
            <div className="text-sm text-slate-300">This is you</div>
          ) : (
            <FollowButton username={user.username} following={following} />
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-amber-400/15 bg-slate-950/40 p-3">
            <div className="text-xs text-slate-300">Followers</div>
            <div className="mt-1 text-lg font-semibold text-white">{user._count.followers}</div>
          </div>
          <div className="rounded-lg border border-amber-400/15 bg-slate-950/40 p-3">
            <div className="text-xs text-slate-300">Following</div>
            <div className="mt-1 text-lg font-semibold text-white">{user._count.following}</div>
          </div>
          <div className="rounded-lg border border-emerald-400/15 bg-slate-950/40 p-3">
            <div className="text-xs text-slate-300">W–L</div>
            <div className="mt-1 text-lg font-semibold text-white">
              {user.wins}–{user.losses}
            </div>
          </div>
          <div className="rounded-lg border border-emerald-400/15 bg-slate-950/40 p-3">
            <div className="text-xs text-slate-300">Points</div>
            <div className="mt-1 text-lg font-semibold text-white">{user.totalPoints}</div>
          </div>
        </div>

        <div className="mt-3 text-sm text-slate-300">
          Games posted: {user.gamesPlayed} · Posts: {user._count.posts}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Posts</h2>
        {user.id === current.id ? (
          <Link href="/new" className="text-sm text-amber-200 hover:text-amber-100">
            Post a match
          </Link>
        ) : null}
      </div>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-emerald-400/15 bg-black/20 p-4 text-slate-300">
            No posts yet.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} liked={likedSet.has(post.id)} />)
        )}
      </div>
    </div>
  );
}
