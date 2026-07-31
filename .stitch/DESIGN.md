# TaskbarHero Tier-List — Design System (Source of Truth)

Gaming UGC tier-list platform. Home/discovery surface. Audience: PT-BR primary, ES/EN secondary.

## Direction
Dark "gamer luxury". Deep charcoal base, saturated per-tier accents, subtle grain/atmosphere. Editorial bento composition, not uniform card grid. Feels like a premium game companion, not a SaaS dashboard.

## Platform
- Web, desktop-first, fully responsive
- Breakpoints: 320 / 768 / 1024 / 1440

## Palette (role → hex)
| Role | Name | Hex |
|---|---|---|
| Base background | Charcoal 950 | `#0d0f14` |
| Surface / card | Charcoal 900 | `#161a22` |
| Surface raised | Charcoal 800 | `#1e2430` |
| Border / hairline | Slate 700 | `#2a3341` |
| Text primary | Fog 50 | `#f2f4f8` |
| Text muted | Slate 400 | `#8b96a8` |
| Primary action | Ember | `#ff5b3d` |
| Tier S | Gold | `#f5c542` |
| Tier A | Violet | `#8b5cf6` |
| Tier B | Teal | `#2dd4bf` |
| Tier C | Slate | `#64748b` |

## Typography
- Display / headings: condensed grotesque (e.g. "Archivo", "Bebas"-adjacent). Tight, big scale contrast.
- Body / data: clean sans ("Inter"). High legibility for dense card meta.
- Scale: hero `clamp(2.5rem,1rem+6vw,5rem)`, section `1.5rem`, body `1rem`, meta `0.8125rem`.

## Surface / elevation
- Radius: cards `16px`, chips/pills `999px`, buttons `12px`.
- Shadow: layered soft — `0 8px 24px rgba(0,0,0,.45)` on raised, tier strip inner glow on hover.
- Grain: subtle noise overlay `opacity .04` on base.

## Motion (compositor-only: transform/opacity)
- Card hover: `translateY(-4px)` + shadow bloom, `220ms cubic-bezier(.16,1,.3,1)`.
- Hero load: staggered opacity+translateY reveal.
- Focus ring: `2px` ember outline, offset `2px`.

## Page structure (Home/discovery)
1. **Sticky nav** — logo left; Tools dropdown (8 game tools: Farming Calc, BiS Finder, Damage Calc, Drop Lookup, Save Import, Market, Patch Sync, more); global search center; language switch (PT-BR) + login/avatar right. Glass hairline bottom border.
2. **Hero** — condensed headline, subline, central search, primary "Criar tier list" CTA (ember), secondary "Explorar" ghost.
3. **Category chips** — pill row: Personagens / Armas / Patch / Classe / Meta. Active = filled, rest = outline.
4. **Trending bento grid** — asymmetric: 1 XL featured + mixed medium/small. Each card: title, author avatar+name, S/A/B/C tier preview strip (4 colored segments w/ mini thumbnails), votes ▲, comments 💬. Hover lift.
5. **Recently published** — compact vertical list rows: thumb, title, author, relative time, votes.
6. **Footer** — tool links, language, community, i18n placeholders.

## i18n
All copy via `data-i18n` keys. Default locale `pt-BR`. No hardcoded strings in components.
