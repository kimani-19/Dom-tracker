"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        if (!confirm("Delete this post?")) return;
        setPending(true);
        try {
          await fetch(`/api/posts/${postId}`, { method: "DELETE" });
          router.push("/");
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
        className="rounded-md border border-rose-400/35 bg-rose-500/10 px-3 py-1.5 text-sm text-rose-100 hover:bg-rose-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
