import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

export const runtime = "nodejs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Domino Social",
  description: "Share domino matches, follow players, and track stats.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh bg-gradient-to-b from-black via-slate-950 to-emerald-950 text-slate-50`}
      >
        <header className="border-b border-emerald-400/15 bg-black/30">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-slate-950" />
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-semibold tracking-tight text-amber-200 hover:text-amber-100">
              Domino Social
            </Link>

            <nav className="flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <Link
                    href="/"
                    className="rounded-md border border-emerald-400/20 bg-black/20 px-3 py-1.5 font-medium text-slate-100 hover:bg-black/30 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  >
                    Feed
                  </Link>
                  <Link
                    href="/new"
                    className="rounded-md border border-emerald-400/20 bg-black/20 px-3 py-1.5 font-medium text-slate-100 hover:bg-black/30 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  >
                    New Match
                  </Link>
                  <Link
                    href={`/u/${user.username}`}
                    className="rounded-md border border-emerald-400/20 bg-black/20 px-3 py-1.5 font-medium text-slate-100 hover:bg-black/30 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  >
                    Profile
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-md border border-emerald-400/25 bg-black/20 px-3 py-1.5 font-medium text-slate-100 hover:bg-black/30 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-md bg-gradient-to-r from-emerald-500 to-amber-400 px-3 py-1.5 font-semibold text-slate-950 hover:from-emerald-400 hover:to-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
