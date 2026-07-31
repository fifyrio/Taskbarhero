// Domain types for the TBH tier-list data model.
// Mirrors supabase/migrations/20260731_tier_lists.sql.

export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'legendary'
  | 'immortal'
  | 'arcana'
  | 'divine';

export type TierGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export type TierListStatus = 'draft' | 'published' | 'archived';

export interface Game {
  id: string;
  slug: string;
  name: string;
  iconUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Entity {
  id: string;
  gameId: string;
  slug: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
  rarity: Rarity | null;
  stats: Record<string, unknown>;
}

export interface TierListItem {
  id: string;
  tierListId: string;
  entityId: string;
  tier: TierGrade;
  position: number;
  note: string | null;
  entity?: Entity;
}

export interface TierList {
  id: string;
  userId: string;
  gameId: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  coverUrl: string | null;
  locale: string;
  status: TierListStatus;
  upvotes: number;
  downvotes: number;
  views: number;
  commentCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TierListWithItems extends TierList {
  items: TierListItem[];
}

/** Compact shape used by discovery cards (trending / recent). */
export interface TierListSummary {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  coverUrl: string | null;
  upvotes: number;
  commentCount: number;
  authorName: string | null;
  authorAvatar: string | null;
  publishedAt: string | null;
}

export interface TierListVote {
  id: string;
  tierListId: string;
  userId: string;
  value: -1 | 1;
}

export interface TierListComment {
  id: string;
  tierListId: string;
  userId: string;
  body: string;
  createdAt: string;
}

export interface CreateTierListInput {
  gameId: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  coverUrl?: string;
  locale?: string;
}

export interface UpdateTierListInput {
  title?: string;
  description?: string;
  category?: string;
  coverUrl?: string;
  status?: TierListStatus;
}
