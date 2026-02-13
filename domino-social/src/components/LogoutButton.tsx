"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await fetch("/api/auth/logout", { method: "POST" });
          router.push("/login");
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
      className="rounded-md border border-emerald-400/25 bg-black/20 px-3 py-1.5 text-slate-100 hover:bg-black/30 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 disabled:opacity-60"
    >
      {loading ? "Logging out…" : "Logout"}
    </button>
  );
}
