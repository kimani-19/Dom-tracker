"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FollowButton({
  username,
  following,
}: {
  username: string;
  following: boolean;
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
          await fetch(`/api/follows/${username}`, {
            method: following ? "DELETE" : "POST",
          });
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
      className={`rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 disabled:opacity-60 ${
        following
          ? "border-emerald-400/25 bg-black/20 text-slate-100 hover:bg-black/30 hover:text-amber-100"
          : "border-amber-400/30 bg-gradient-to-r from-emerald-500 to-amber-400 font-semibold text-slate-950 hover:from-emerald-400 hover:to-amber-300"
      }`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
