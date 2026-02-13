"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LikeButton({
  postId,
  liked,
  likeCount,
}: {
  postId: string;
  liked: boolean;
  likeCount: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          await fetch(`/api/posts/${postId}/like`, {
            method: liked ? "DELETE" : "POST",
          });
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
      className={`rounded-md border px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 disabled:opacity-60 ${
        liked
          ? "border-amber-400/40 bg-amber-400/15 text-amber-100 hover:bg-amber-400/20"
          : "border-emerald-400/25 bg-black/20 text-slate-100 hover:bg-black/30 hover:border-emerald-400/35"
      }`}
    >
      {liked ? "Liked" : "Like"} · {likeCount}
    </button>
  );
}
