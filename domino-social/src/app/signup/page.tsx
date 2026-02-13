"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
      <p className="mt-1 text-sm text-slate-300">Create your account.</p>

      <form
        className="mt-6 space-y-3 rounded-xl border border-emerald-400/15 bg-black/20 p-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);
          try {
            const res = await fetch("/api/auth/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, displayName, password }),
            });
            const data = (await res.json().catch(() => null)) as { error?: string } | null;
            if (!res.ok) {
              setError(data?.error ?? "Sign up failed.");
              return;
            }
            router.push("/");
            router.refresh();
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="block">
          <div className="text-sm text-slate-200">Username</div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
            autoComplete="username"
          />
          <div className="mt-1 text-xs text-slate-300">letters, numbers, underscore</div>
        </label>

        <label className="block">
          <div className="text-sm text-slate-200">Display name</div>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
            placeholder="Optional (defaults to username)"
          />
        </label>

        <label className="block">
          <div className="text-sm text-slate-200">Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-emerald-400/20 bg-slate-950/40 px-3 py-2 text-slate-50 outline-none focus:border-amber-400/30"
            autoComplete="new-password"
          />
        </label>

        {error ? <div className="text-sm text-rose-300">{error}</div> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gradient-to-r from-emerald-500 to-amber-400 px-3 py-2 text-sm font-medium text-slate-950 hover:from-emerald-400 hover:to-amber-300 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-300">
        Already have an account?{" "}
        <Link href="/login" className="text-amber-200 hover:text-amber-100">
          Login
        </Link>
      </p>
    </div>
  );
}
