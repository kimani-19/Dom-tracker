# Domino Social (MVP)

A small domino “social media” site built with Next.js + Prisma + SQLite.

## Features

- Real auth (signup/login/logout) with hashed passwords and httpOnly session cookies
- Profiles with stats (games, W/L, points), followers/following counts
- Follow/unfollow
- Feed of match posts (your posts + people you follow; falls back to global if empty)
- Create a match post (teams, scores, winning score, your side, notes, optional photo URL)
- Like/unlike, comment/delete your own comment, delete your own post

## Run locally

From the repo root:

```bash
cd domino-social
npm install
```

Create the database & generate Prisma client:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000

## Useful commands

```bash
# Prisma Studio
npm run prisma:studio

# Reset DB (dev)
npx prisma migrate reset
```

## Routes

- `/login`, `/signup`
- `/` feed
- `/new` create match post
- `/u/[username]` profile
- `/p/[postId]` post details + comments

## Notes

- The original static prototype still lives at the repo root (`index.html`, `script.js`, `styles.css`).
- SQLite database file is `domino-social/dev.db` (controlled by `domino-social/.env`).
