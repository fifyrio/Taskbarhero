-- TBH Tier List Wiki — core UGC data model.
-- Games → Entities (rankable items) → user Tier Lists → Items / Votes / Comments.
-- Conventions mirror the existing schema: uuid PKs, utc timestamps, RLS on user data.

-- ---------------------------------------------------------------------------
-- Reference data: games + rankable entities (items, heroes, runes, ...)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.games (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT games_pkey PRIMARY KEY (id)
);

-- Rarity mirrors the design token system (uncommon..divine); nullable for neutral items.
CREATE TABLE IF NOT EXISTS public.entities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  game_id uuid NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  category text,                       -- gear | hero | rune | monster | material ...
  image_url text,
  rarity text CHECK (rarity IS NULL OR rarity = ANY (ARRAY[
    'common','uncommon','rare','legendary','immortal','arcana','divine'])),
  stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT entities_pkey PRIMARY KEY (id),
  CONSTRAINT entities_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE,
  CONSTRAINT entities_game_slug_uq UNIQUE (game_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_entities_game_category
  ON public.entities (game_id, category);

-- ---------------------------------------------------------------------------
-- User-generated tier lists
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tier_lists (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  game_id uuid NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category text,                       -- characters | weapons | patch | class | meta
  cover_url text,
  locale text NOT NULL DEFAULT 'pt-BR',
  status text NOT NULL DEFAULT 'draft'
    CHECK (status = ANY (ARRAY['draft','published','archived'])),
  upvotes integer NOT NULL DEFAULT 0,
  downvotes integer NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tier_lists_pkey PRIMARY KEY (id),
  CONSTRAINT tier_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  CONSTRAINT tier_lists_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE
);

-- Discovery: trending (published, most upvoted) + recent feed.
CREATE INDEX IF NOT EXISTS idx_tier_lists_published_upvotes
  ON public.tier_lists (upvotes DESC, published_at DESC)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_tier_lists_published_recent
  ON public.tier_lists (published_at DESC)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_tier_lists_owner
  ON public.tier_lists (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_tier_lists_game_category
  ON public.tier_lists (game_id, category)
  WHERE status = 'published';

-- One row per entity placed on a list, in a tier row.
CREATE TABLE IF NOT EXISTS public.tier_list_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  tier_list_id uuid NOT NULL,
  entity_id uuid NOT NULL,
  tier text NOT NULL CHECK (tier = ANY (ARRAY['S','A','B','C','D','F'])),
  position integer NOT NULL DEFAULT 0,
  note text,
  CONSTRAINT tier_list_items_pkey PRIMARY KEY (id),
  CONSTRAINT tier_list_items_list_fkey FOREIGN KEY (tier_list_id) REFERENCES public.tier_lists(id) ON DELETE CASCADE,
  CONSTRAINT tier_list_items_entity_fkey FOREIGN KEY (entity_id) REFERENCES public.entities(id) ON DELETE CASCADE,
  CONSTRAINT tier_list_items_uq UNIQUE (tier_list_id, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_tier_list_items_list
  ON public.tier_list_items (tier_list_id, tier, position);

-- One vote per user per list (value +1 / -1).
CREATE TABLE IF NOT EXISTS public.tier_list_votes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  tier_list_id uuid NOT NULL,
  user_id uuid NOT NULL,
  value smallint NOT NULL CHECK (value = ANY (ARRAY[-1, 1])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tier_list_votes_pkey PRIMARY KEY (id),
  CONSTRAINT tier_list_votes_list_fkey FOREIGN KEY (tier_list_id) REFERENCES public.tier_lists(id) ON DELETE CASCADE,
  CONSTRAINT tier_list_votes_user_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  CONSTRAINT tier_list_votes_uq UNIQUE (tier_list_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.tier_list_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  tier_list_id uuid NOT NULL,
  user_id uuid NOT NULL,
  body text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tier_list_comments_pkey PRIMARY KEY (id),
  CONSTRAINT tier_list_comments_list_fkey FOREIGN KEY (tier_list_id) REFERENCES public.tier_lists(id) ON DELETE CASCADE,
  CONSTRAINT tier_list_comments_user_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tier_list_comments_list
  ON public.tier_list_comments (tier_list_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- updated_at trigger for tier_lists
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tier_lists_updated_at ON public.tier_lists;
CREATE TRIGGER trg_tier_lists_updated_at
  BEFORE UPDATE ON public.tier_lists
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.games                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_lists           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_list_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_list_votes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_list_comments   ENABLE ROW LEVEL SECURITY;

-- Reference data: readable by everyone, writes reserved for service role.
DROP POLICY IF EXISTS games_read      ON public.games;
CREATE POLICY games_read      ON public.games      FOR SELECT USING (true);
DROP POLICY IF EXISTS entities_read   ON public.entities;
CREATE POLICY entities_read   ON public.entities   FOR SELECT USING (true);

-- Tier lists: published are public; owners see + manage their own (incl. drafts).
DROP POLICY IF EXISTS tier_lists_read_published ON public.tier_lists;
CREATE POLICY tier_lists_read_published ON public.tier_lists
  FOR SELECT USING (status = 'published' OR user_id = auth.uid());
DROP POLICY IF EXISTS tier_lists_insert_own ON public.tier_lists;
CREATE POLICY tier_lists_insert_own ON public.tier_lists
  FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS tier_lists_update_own ON public.tier_lists;
CREATE POLICY tier_lists_update_own ON public.tier_lists
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS tier_lists_delete_own ON public.tier_lists;
CREATE POLICY tier_lists_delete_own ON public.tier_lists
  FOR DELETE USING (user_id = auth.uid());

-- Items: readable when the parent list is visible; writable by the list owner.
DROP POLICY IF EXISTS tier_list_items_read ON public.tier_list_items;
CREATE POLICY tier_list_items_read ON public.tier_list_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.tier_lists l
    WHERE l.id = tier_list_id AND (l.status = 'published' OR l.user_id = auth.uid())));
DROP POLICY IF EXISTS tier_list_items_write ON public.tier_list_items;
CREATE POLICY tier_list_items_write ON public.tier_list_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.tier_lists l
    WHERE l.id = tier_list_id AND l.user_id = auth.uid()))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.tier_lists l
    WHERE l.id = tier_list_id AND l.user_id = auth.uid()));

-- Votes: anyone can read counts; authenticated users manage their own vote.
DROP POLICY IF EXISTS tier_list_votes_read ON public.tier_list_votes;
CREATE POLICY tier_list_votes_read ON public.tier_list_votes
  FOR SELECT USING (true);
DROP POLICY IF EXISTS tier_list_votes_write ON public.tier_list_votes;
CREATE POLICY tier_list_votes_write ON public.tier_list_votes
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Comments: public read; author writes their own.
DROP POLICY IF EXISTS tier_list_comments_read ON public.tier_list_comments;
CREATE POLICY tier_list_comments_read ON public.tier_list_comments
  FOR SELECT USING (true);
DROP POLICY IF EXISTS tier_list_comments_write ON public.tier_list_comments;
CREATE POLICY tier_list_comments_write ON public.tier_list_comments
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
