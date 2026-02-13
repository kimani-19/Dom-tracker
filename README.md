# Dom-tracker

This repo contains two things:

1) **Original prototype (static)** — a simple DOM-based domino score tracker at the repo root:
   - `index.html`, `script.js`, `styles.css`

2) **Domino Social (Next.js app)** — the real “domino social media” MVP inside `domino-social/`:
   - Next.js (App Router) + TypeScript + Tailwind
   - Prisma + SQLite
   - Cookie-based sessions (httpOnly)

## Domino Social: Features

- Signup / login / logout (hashed passwords + session cookie)
- Profiles with stats (games, W/L, points) + follower/following counts
- Follow / unfollow
- Feed of match posts (you + people you follow; falls back to global)
- Post a match (teams, scores, winning score, your side, notes, optional photo URL)
- Like / unlike, comment, delete your own comment, delete your own post

## Run the Domino Social app locally

From the repo root:

```bash
cd domino-social
npm install
```

Create the SQLite database, apply migrations, and generate Prisma client:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Notes

- The SQLite database file is created locally (ignored by git). If you want a fresh DB: `npx prisma migrate reset`.
- More details specific to the Next.js app are in `domino-social/README.md`.
