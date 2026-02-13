"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCommentButton({ commentId }: { commentId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
        className="rounded-md px-1.5 py-0.5 text-xs text-rose-100 hover:bg-rose-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
