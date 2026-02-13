import Link from "next/link";
import { redirect } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export default async function FeedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    select: { followingId: true },
  });

  const authorIds = [user.id, ...following.map((f) => f.followingId)];

  let posts = await prisma.post.findMany({
    where: { authorId: { in: authorIds } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { username: true, displayName: true } },
      match: true,
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (posts.length === 0) {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        author: { select: { username: true, displayName: true } },
        match: true,
        _count: { select: { likes: true, comments: true } },
      },
    });
  }

  const liked = await prisma.like.findMany({
    where: { userId: user.id, postId: { in: posts.map((p) => p.id) } },
    select: { postId: true },
  });
  const likedSet = new Set(liked.map((l) => l.postId));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
          <p className="mt-1 text-sm text-slate-300">
            Matches from you and players you follow.
          </p>
        </div>

        <Link
          href="/new"
          className="rounded-md bg-gradient-to-r from-emerald-500 to-amber-400 px-3 py-2 text-sm font-medium text-slate-950 hover:from-emerald-400 hover:to-amber-300"
        >
          Post a match
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} liked={likedSet.has(post.id)} />
        ))}
      </div>
    </div>
  );
}
