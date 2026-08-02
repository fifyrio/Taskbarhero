# TBH Tier List Wiki — Project Guide

Community tier-list wiki for "TBH: Task Bar Hero". Users create, share, and vote on
S/A/B/C/D/F rankings of in-game entities (gear, heroes, runes, materials).

Built on a Next.js 14 (App Router) base, stripped of its original AI-image / payment
features. Immersive game UI: gold `#f6b73c`, dark surfaces, rarity colors, DOS/mono type.

## Stack

- **Next.js 14.0.1** (App Router) + React 18 + TypeScript
- **Supabase** — Postgres + Auth (Google OAuth). Client in `src/lib/supabase.ts`,
  server client in `src/lib/supabase-server.ts`
- **next-intl** — 14 locales (`messages/*.json`). English at root (no `/en` prefix),
  others prefixed (`/zh`, `/de`, …)
- **Tailwind** — design tokens (gold/surface/rarity) in `tailwind.config.js`
- **pnpm** (`packageManager` pinned) + Node 22 (Vercel)
- Fonts loaded at runtime via `<link>` in `layout.tsx` (no build-time `next/font` fetch)

## Data model

Migration: `supabase/migrations/20260731_tier_lists.sql`. Seed: `supabase/seed_tier_lists.sql`.

- `games` — rankable game titles (reference data)
- `entities` — rankable items per game (rarity: common..divine)
- `user_profiles` — auth profile (FK auth.users), created on first login via `/api/profile`
- `tier_lists` — user-owned rankings (draft/published/archived), upvotes/views counts
- `tier_list_items` — entity placed in a tier row (S/A/B/C/D/F + position)
- `tier_list_votes` — one ±1 vote per user per list
- `tier_list_comments`

RLS: reference data public-read; tier lists public when published, owner-managed otherwise.

## Key paths

- `src/lib/tier-lists.ts` — repository (getGames, getEntitiesByGame, trending/recent,
  bySlug, create, setItems, vote)
- `src/types/tier-list.ts` — domain types
- Routes: `/tier-lists` (index), `/tier-lists/[slug]` (viewer), `/tier-lists/new` (builder)
- API: `/api/games`, `/api/entities`, `/api/tier-lists`, `/api/tier-lists/[id]/vote`,
  `/api/profile`
- Homepage design components: `src/components/tier-home/*` (currently mock data — swap to
  real `getTrending`/`getRecent` once there is enough published UGC)

## Conventions

- Immutable updates, small focused files, explicit error handling
- SEO: English canonical without `/en`; English-only for now (locales in
  `src/i18n/config.ts`, re-add once translations are complete).
  Production domain `https://taskbarherowiki.co` (taskbarhero.wiki is third-party — never use for canonical/OG/sitemap)
- Commands: `pnpm dev` (port 3001), `pnpm build`, `pnpm lint`, `pnpm type-check`

## Deploy (Vercel)

Framework preset **Next.js**. Required env:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
Enable Google provider + redirect URLs in Supabase Auth for login.
