"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function NewMatchPage() {
  const router = useRouter();
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [authorSide, setAuthorSide] = useState<"A" | "B">("A");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [winningScore, setWinningScore] = useState(5);
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const winnerPreview = useMemo(() => {
    if (scoreA === scoreB) return "Tie";
    return scoreA > scoreB ? teamAName : teamBName;
  }, [scoreA, scoreB, teamAName, teamBName]);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Post a match</h1>
        <p className="mt-1 text-sm text-slate-300">Share the final score with your followers.</p>
      </div>

      <form
        className="rounded-xl border border-emerald-400/15 bg-black/20 p-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);
          try {
            const res = await fetch("/api/posts/match", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                teamAName,
                teamBName,
                authorSide,
                scoreA,
                scoreB,
                winningScore,
                notes,
                photoUrl: photoUrl.trim() || null,
              }),
            });

            const data = (await res.json().catch(() => null)) as
              | { error?: string; postId?: string }
              | null;

            if (!res.ok) {
              setError(data?.error ?? "Could not create post.");
              return;
            }

            router.push(`/p/${data?.postId}`);
            router.refresh();
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <div className="text-sm text-slate-200">Team A name</div>
            <input
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
            />
          </label>
          <label className="block">
            <div className="text-sm text-slate-200">Team B name</div>
            <input
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
            />
          </label>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block">
            <div className="text-sm text-slate-200">Score A</div>
            <input
              type="number"
              value={scoreA}
              onChange={(e) => setScoreA(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
              min={0}
              max={1000}
            />
          </label>
          <label className="block">
            <div className="text-sm text-slate-200">Score B</div>
            <input
              type="number"
              value={scoreB}
              onChange={(e) => setScoreB(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
              min={0}
              max={1000}
            />
          </label>
          <label className="block">
            <div className="text-sm text-slate-200">Winning score</div>
            <input
              type="number"
              value={winningScore}
              onChange={(e) => setWinningScore(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
              min={1}
              max={1000}
            />
          </label>
        </div>

        <label className="mt-3 block">
          <div className="text-sm text-slate-200">Which team were you?</div>
          <select
            value={authorSide}
            onChange={(e) => setAuthorSide(e.target.value as "A" | "B")}
            className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
          >
            <option value="A">Team A</option>
            <option value="B">Team B</option>
          </select>
        </label>

        <div className="mt-3 text-sm text-slate-300">
          Winner preview: <span className="text-amber-200">{winnerPreview}</span>
        </div>

        <label className="mt-3 block">
          <div className="text-sm text-slate-200">Notes (optional)</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
            rows={4}
            placeholder="Great game, close finish…"
          />
        </label>

        <label className="mt-3 block">
          <div className="text-sm text-slate-200">Photo URL (optional)</div>
          <input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
            placeholder="https://..."
          />
        </label>

        {error ? <div className="mt-3 text-sm text-rose-300">{error}</div> : null}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-gradient-to-r from-emerald-500 to-amber-400 px-4 py-2 text-sm font-medium text-slate-950 hover:from-emerald-400 hover:to-amber-300 disabled:opacity-60"
          >
            {loading ? "Posting…" : "Post match"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => router.push("/")}
            className="rounded-md border border-emerald-400/25 bg-black/20 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-black/30 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
