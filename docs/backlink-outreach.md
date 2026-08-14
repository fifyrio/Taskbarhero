# Backlink & Outreach Playbook — TaskBarHeroWiki

Working doc for off-page SEO. Framework distilled from the `backlink-building` skill
(web.cafe / 哥飞社群 实操). This file is the single source of truth for the **submission
material kit** (§1) and the **outreach tracking log** (§2). Fill the log every time you
place a link.

- **Domain (canonical):** `https://www.taskbarherowiki.co` — never use the third-party
  `taskbarhero.wiki` for canonical/OG/links.
- **Category / competition tier:** new game wiki + emerging keyword ("TBH: Task Bar Hero").
  Low-competition bucket → **volume of low-authority links wins early rankings**; buy
  high-authority links only *after* organic traffic starts (skill §1).
- **Sequence:** free high-authority platforms + directories to build RD breadth →
  once RD is up but rankings sit ≥5 days → shift to guest posts / resource pages / newsletters
  for editorial links (skill §2).

---

## 1. Submission material kit (make once, reuse everywhere)

Keep 2–3 rewrite variants of each description to avoid a footprint. Core keyword appears
**once, naturally** per variant — no stuffing (skill §8).

### Identity
- **Product name:** TaskBarHeroWiki (matches domain/brand)
- **Homepage URL:** `https://www.taskbarherowiki.co` (no UTM junk params when submitting)
- **Category tags (3–5):** Gaming · Wiki / Database · Tier Lists · Game Guides · Community Tools

### Tagline (≤60 chars, verb-first, "for whom / solves what")
- V1: `Rank and share community tier lists for TBH: Task Bar Hero`
- V2: `Browse the TBH gear, hero & stage database — and rank it`
- V3: `Community S/A/B/C/D/F rankings for Task Bar Hero`

### Short description (80–160 chars, directory use, core term ×1)
- V1: `Community wiki for TBH: Task Bar Hero. Browse the gear, hero, rune and stage database, then build and vote on S/A/B/C/D/F tier lists.`
- V2: `The Task Bar Hero database and tier-list hub. Explore items, heroes and stages, create rankings, and vote with the community.`

### Medium description (250–300 chars, features + differentiator)
> TaskBarHeroWiki is a community-driven database and tier-list wiki for TBH: Task Bar Hero.
> Search the full game database — gear, heroes, runes, monsters, skills, stages — with drop
> and craft sources on every item page. Signed-in players build S/A/B/C/D/F tier lists,
> publish them, and upvote the community's best rankings. Free, no login to browse.

### Long description (~500 chars, scenario + why you)
> TaskBarHeroWiki is the community reference for TBH: Task Bar Hero. Every gear item shows
> its grade, stats and how to get it (drop/craft source), so you can answer "what should I
> farm next" without leaving the page. The tier-list builder lets players drag entities into
> S/A/B/C/D/F rows, publish a ranking, and share it — the community upvotes the meta that
> actually holds up. Unlike a static fan wiki, rankings are living UGC: trending and recent
> lists surface what players believe right now. Browse free; sign in with Google to build.
> Data-driven, fast, and built for the game's early competitive scene.

### Assets checklist (produce before first submission)
- [ ] Square transparent PNG logo ≥240px
- [ ] 1–3 real UI screenshots ≥1270×760 (homepage database grid + a real tier-list page)
- [ ] OG image 1200×630 (currently falls back to `/images/logo.png` — **make a real one**)
- [ ] Demo GIF <10s (tier-list builder: drag entity → publish)
- [ ] Founder bio, 1 sentence + contact email

> ⚠️ Prereq gap: OG image is still the logo fallback (`src/app/[locale]/page.tsx:65`).
> A real 1200×630 OG card should ship before Product Hunt / social submission.

### Red lines (skill §8 通用红线)
1. **Truthful** — it's our own product; no fake votes/reviews.
2. **Relevant** — only submit to gaming / wiki / tool sites that fit.
3. **Distributed** — rotate description variants, vary sources, ramp velocity gently.
4. **Value-first** — in communities, give value first; the link is secondary.

---

## 2. Outreach tracking log

Log every placement. Review signal (skill §10): **RD rising but DA/rank flat → missing
relevance + authority → switch to editorial links.** GSC backlink data lags badly — don't
judge by it alone.

| Date | Channel | Type | Link nature | URL submitted | Indexed? | Referral traffic | Notes |
|------|---------|------|-------------|---------------|----------|------------------|-------|
| | | | | | | | |

**Column values**
- **Type:** directory / PH / HN / reddit / blog-comment / guest-post / resource-page / social
- **Link nature:** dofollow / nofollow / ugc / redirect(3xx)
- **Indexed?:** check `site:domain/path/to/our-listing` ~2–3 weeks later; if not indexed, the
  host site is weak — deprioritize it.

---

## 3. Channel plan (priority order for this site)

### Phase 1 — free high-authority platforms (do at launch)
- [ ] **Product Hunt** (dofollow, one-shot exposure). Maker's first comment = a real story:
      why build a community tier-list wiki for this game. Reply to every comment. No vote-buying.
- [ ] **Reddit** — the game's subreddit + relevant gaming subs (nofollow, but referral + feedback).
      Read each sub's rules; value-first; don't cross-post identical copy.
- [ ] **GitHub / Medium / Indie Hackers / Blogger.com** — project profile + sidebar/friend link.
- [ ] **Game wiki / tier-list aggregator directories** — spread submissions, no single-week spike.

### Phase 2 — cross-validation mining (skill §3, the core volume play)
1. Google "tier list" + category terms; also profile competitors like `game8`, `prydwen`,
   `maxroll`, `gg.deals`, and other **new** game-wiki/tier-list sites (1–2 yrs old — their
   backlinks are mostly self-placed = worth copying).
2. Collect 20+ such domains → export each one's "referring domains" CSV from Ahrefs/Semrush.
3. Hand the CSVs to Claude → script extracts root domains → counts appearances across CSVs →
   sorts desc. Top domains = validated, indexable, "you can submit here" resources.
4. Add results as rows in §2 and work down the list.

> Ready to run: drop the CSVs in `docs/backlink-csvs/` and ask for the cross-validation script.

### Phase 3 — editorial links (once RD is up but rankings stall ≥5 days)
- Guest posts (cold-email template, skill §9): subject `Guest post idea for [site]: [topic]`,
  open with a real comment on one of their specific articles, promise 1200–1500 original words,
  ≤1–2 contextual links.
- "best X tools / best game wikis" resource-page inclusion (template, skill §9).
- `first_seen` competitor backlink copying: pick 1–2 same-niche winners, sort their backlinks
  by first_seen ascending to see what they grabbed during cold start, filter scraper noise,
  outreach the reproducible editorial sources.

---

## 4. The 7-metric filter — vet before copying any competitor link (skill §4)

Competitor has it ≠ you should. Check each: **relevance** · **12-mo traffic trend** (stable,
not a single spike; recent 50–80% drop = possible penalty, skip) · **traffic source** (organic
≥30% healthy; <10% skip) · **top-100 keywords** (product/intent words, not "free movie download")
· **top-10 countries** (match target market) · **DR history** (12-mo, not spot value; DR spike
without traffic growth = faked) · **out/in link ratio** (in-domains ÷ out-domains off by 100×+
= link-selling farm).

**Directory hard-filters:** Ahrefs-flagged spam · under $9/link (skip $1/link) · monthly
traffic <1000 / search traffic <100 / search share <10% · 302/307/JS redirects (don't pass
authority — verify the actual `<a rel>` on an already-listed entry before submitting).
Domain-suffix trap: old blog/BBS engines can't parse `.co`/`.ai`/`.gg` into `<a>` tags — for
those, go straight to guest posts / paid directories.

---

## References
- 外链与内容发布资料库 — 王焱 · https://new.web.cafe/topic/9o5nfe3us3
- 7个SEO外链分析指标 — 陈鹏旭 Curio · https://new.web.cafe/topic/t7d2i3qixc
- 一天收集完高质量外链的方法 — Windyan · https://new.web.cafe/topic/zg27h4qcy9
- 什么样的导航站外链千万别买 — Rhythmus · https://new.web.cafe/topic/z0gct1njcq
