// Repository for tier-list reads/writes. RLS is enforced by Supabase, so these
// helpers use the authenticated client and return a consistent ApiResponse.
import { createAuthenticatedClient } from './supabase-server';
import type { ApiResponse } from '@/types';
import type {
  TierList,
  TierListWithItems,
  TierListSummary,
  TierListItem,
  CreateTierListInput,
  UpdateTierListInput,
  TierGrade,
  Game,
  Entity,
} from '@/types/tier-list';

const DISCOVERY_LIMIT = 24;

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}
function fail<T = never>(error: string): ApiResponse<T> {
  return { success: false, error };
}

function getMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected database error';
}

// -- row → domain mappers (snake_case → camelCase) --------------------------

function toTierList(row: any): TierList {
  return {
    id: row.id,
    userId: row.user_id,
    gameId: row.game_id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    category: row.category,
    coverUrl: row.cover_url,
    locale: row.locale,
    status: row.status,
    upvotes: row.upvotes,
    downvotes: row.downvotes,
    views: row.views,
    commentCount: row.comment_count,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toItem(row: any): TierListItem {
  return {
    id: row.id,
    tierListId: row.tier_list_id,
    entityId: row.entity_id,
    tier: row.tier,
    position: row.position,
    note: row.note,
    entity: row.entities
      ? {
          id: row.entities.id,
          gameId: row.entities.game_id,
          slug: row.entities.slug,
          name: row.entities.name,
          category: row.entities.category,
          imageUrl: row.entities.image_url,
          rarity: row.entities.rarity,
          stats: row.entities.stats ?? {},
        }
      : undefined,
  };
}

function toSummary(row: any): TierListSummary {
  const author = row.user_profiles;
  const name = author
    ? [author.first_name, author.last_name].filter(Boolean).join(' ') || null
    : null;
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    coverUrl: row.cover_url,
    upvotes: row.upvotes,
    commentCount: row.comment_count,
    authorName: name,
    authorAvatar: author?.avatar_url ?? null,
    publishedAt: row.published_at,
  };
}

function toGame(row: any): Game {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    iconUrl: row.icon_url ?? null,
    isActive: row.is_active ?? true,
    sortOrder: row.sort_order ?? 0,
  };
}

function toEntity(row: any): Entity {
  return {
    id: row.id,
    gameId: row.game_id,
    slug: row.slug,
    name: row.name,
    category: row.category ?? null,
    imageUrl: row.image_url ?? null,
    rarity: row.rarity ?? null,
    stats: row.stats ?? {},
  };
}

const SUMMARY_SELECT =
  'id, title, slug, category, cover_url, upvotes, comment_count, published_at, user_profiles ( first_name, last_name, avatar_url )';

// -- public catalog reads (games / entities) --------------------------------

export async function getGames(): Promise<ApiResponse<Game[]>> {
  try {
    const supabase = await createAuthenticatedClient();
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) return fail(error.message);
    return ok((data ?? []).map(toGame));
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}

export async function getEntitiesByGame(
  gameId: string
): Promise<ApiResponse<Entity[]>> {
  try {
    const supabase = await createAuthenticatedClient();
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('game_id', gameId)
      .order('name', { ascending: true });
    if (error) return fail(error.message);
    return ok((data ?? []).map(toEntity));
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}

// -- discovery reads --------------------------------------------------------

export async function getTrendingTierLists(
  limit = DISCOVERY_LIMIT
): Promise<ApiResponse<TierListSummary[]>> {
  try {
    const supabase = await createAuthenticatedClient();
    const { data, error } = await supabase
      .from('tier_lists')
      .select(SUMMARY_SELECT)
      .eq('status', 'published')
      .order('upvotes', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) return fail(error.message);
    return ok((data ?? []).map(toSummary));
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}

export async function getRecentTierLists(
  limit = DISCOVERY_LIMIT
): Promise<ApiResponse<TierListSummary[]>> {
  try {
    const supabase = await createAuthenticatedClient();
    const { data, error } = await supabase
      .from('tier_lists')
      .select(SUMMARY_SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) return fail(error.message);
    return ok((data ?? []).map(toSummary));
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}

export async function getTierListBySlug(
  slug: string
): Promise<ApiResponse<TierListWithItems>> {
  try {
    const supabase = await createAuthenticatedClient();
    const { data, error } = await supabase
      .from('tier_lists')
      .select('*, tier_list_items ( *, entities ( * ) )')
      .eq('slug', slug)
      .maybeSingle();
    if (error) return fail(error.message);
    if (!data) return fail('Tier list not found');
    const items = (data.tier_list_items ?? [])
      .map(toItem)
      .sort((a: TierListItem, b: TierListItem) => a.position - b.position);
    return ok({ ...toTierList(data), items });
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}

export async function getTierListsByUser(
  userId: string
): Promise<ApiResponse<TierList[]>> {
  try {
    const supabase = await createAuthenticatedClient();
    const { data, error } = await supabase
      .from('tier_lists')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) return fail(error.message);
    return ok((data ?? []).map(toTierList));
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}

// -- writes -----------------------------------------------------------------

export async function createTierList(
  userId: string,
  input: CreateTierListInput
): Promise<ApiResponse<TierList>> {
  try {
    const supabase = await createAuthenticatedClient();
    const { data, error } = await supabase
      .from('tier_lists')
      .insert({
        user_id: userId,
        game_id: input.gameId,
        title: input.title,
        slug: input.slug,
        description: input.description ?? null,
        category: input.category ?? null,
        cover_url: input.coverUrl ?? null,
        locale: input.locale ?? 'pt-BR',
      })
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(toTierList(data));
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}

export async function updateTierList(
  id: string,
  input: UpdateTierListInput
): Promise<ApiResponse<TierList>> {
  try {
    const supabase = await createAuthenticatedClient();
    const patch: Record<string, unknown> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.description !== undefined) patch.description = input.description;
    if (input.category !== undefined) patch.category = input.category;
    if (input.coverUrl !== undefined) patch.cover_url = input.coverUrl;
    if (input.status !== undefined) {
      patch.status = input.status;
      if (input.status === 'published') {
        patch.published_at = new Date().toISOString();
      }
    }
    const { data, error } = await supabase
      .from('tier_lists')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();
    if (error) return fail(error.message);
    return ok(toTierList(data));
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}

/** Replace all items on a list in one shot (builder save). */
export async function setTierListItems(
  tierListId: string,
  items: Array<{ entityId: string; tier: TierGrade; position: number; note?: string }>
): Promise<ApiResponse<null>> {
  try {
    const supabase = await createAuthenticatedClient();
    const del = await supabase
      .from('tier_list_items')
      .delete()
      .eq('tier_list_id', tierListId);
    if (del.error) return fail(del.error.message);
    if (items.length === 0) return ok(null);
    const { error } = await supabase.from('tier_list_items').insert(
      items.map((it) => ({
        tier_list_id: tierListId,
        entity_id: it.entityId,
        tier: it.tier,
        position: it.position,
        note: it.note ?? null,
      }))
    );
    if (error) return fail(error.message);
    return ok(null);
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}

/** Upsert a user's vote (+1 / -1). */
export async function voteTierList(
  tierListId: string,
  userId: string,
  value: -1 | 1
): Promise<ApiResponse<null>> {
  try {
    const supabase = await createAuthenticatedClient();
    const { error } = await supabase
      .from('tier_list_votes')
      .upsert(
        { tier_list_id: tierListId, user_id: userId, value },
        { onConflict: 'tier_list_id,user_id' }
      );
    if (error) return fail(error.message);
    return ok(null);
  } catch (error: unknown) {
    return fail(getMessage(error));
  }
}
