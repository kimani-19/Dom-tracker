"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CommentForm({ postId }: { postId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setPending(true);
        try {
          const res = await fetch(`/api/posts/${postId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body }),
          });
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          if (!res.ok) {
            setError(data?.error ?? "Could not comment.");
            return;
          }
          setBody("");
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
    >
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Write a comment…"
        className="w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
      />

      {error ? <div className="text-sm text-rose-300">{error}</div> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gradient-to-r from-emerald-500 to-amber-400 px-3 py-2 text-sm font-medium text-slate-950 hover:from-emerald-400 hover:to-amber-300 disabled:opacity-60"
      >
        {pending ? "Posting…" : "Comment"}
      </button>
    </form>
  );
}
