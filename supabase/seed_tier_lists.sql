-- Reference-data seed for the tier-list model (idempotent).
-- Run AFTER 20260731_tier_lists.sql. User-owned tier lists are created via the app.

INSERT INTO public.games (slug, name, sort_order)
VALUES ('tbh', 'TBH: Task Bar Hero', 0)
ON CONFLICT (slug) DO NOTHING;

-- A few rankable entities across rarities so the builder + tiers have content.
INSERT INTO public.entities (game_id, slug, name, category, rarity)
SELECT g.id, v.slug, v.name, v.category, v.rarity
FROM public.games g
CROSS JOIN (VALUES
  ('void-crystal',   'Void Crystal',    'material', 'divine'),
  ('iron-ore',       'Iron Ore',        'material', 'common'),
  ('aurelius',       'Aurelius',        'hero',     'immortal'),
  ('heavy-plate',    'Heavy Plate',     'gear',     'rare'),
  ('rune-of-fury',   'Rune of Fury',    'rune',     'arcana'),
  ('swift-boots',    'Swift Boots',     'gear',     'uncommon'),
  ('dragon-scale',   'Dragon Scale',    'gear',     'legendary'),
  ('stamina-charm',  'Stamina Charm',   'gear',     'rare')
) AS v(slug, name, category, rarity)
WHERE g.slug = 'tbh'
ON CONFLICT (game_id, slug) DO NOTHING;
