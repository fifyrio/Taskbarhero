import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/lib/supabase-server';
import {
  getRecentTierLists,
  getTrendingTierLists,
  createTierList,
  setTierListItems,
  updateTierList,
} from '@/lib/tier-lists';
import type { TierGrade } from '@/types/tier-list';

export const dynamic = 'force-dynamic';

// GET /api/tier-lists?sort=recent|trending&limit=24
export async function GET(request: NextRequest) {
  try {
    const sort = request.nextUrl.searchParams.get('sort') ?? 'recent';
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Math.min(Number(limitParam) || 24, 48) : 24;

    const result =
      sort === 'trending'
        ? await getTrendingTierLists(limit)
        : await getRecentTierLists(limit);

    return NextResponse.json(result, { status: result.success ? 200 : 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ success: false, error: message }, { status: 200 });
  }
}

interface CreateBody {
  gameId?: string;
  title?: string;
  slug?: string;
  description?: string;
  category?: string;
  coverUrl?: string;
  locale?: string;
  status?: 'draft' | 'published';
  items?: Array<{ entityId: string; tier: TierGrade; position: number; note?: string }>;
}

// POST /api/tier-lists — create a list (+ optional items). Auth required.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createAuthenticatedClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CreateBody;
    if (!body.gameId || !body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'gameId, title e slug são obrigatórios' },
        { status: 400 }
      );
    }

    const created = await createTierList(user.id, {
      gameId: body.gameId,
      title: body.title,
      slug: body.slug,
      description: body.description,
      category: body.category,
      coverUrl: body.coverUrl,
      locale: body.locale,
    });
    if (!created.success || !created.data) {
      return NextResponse.json(created, { status: 400 });
    }

    if (body.items && body.items.length > 0) {
      const itemsResult = await setTierListItems(created.data.id, body.items);
      if (!itemsResult.success) {
        return NextResponse.json(itemsResult, { status: 400 });
      }
    }

    // Publishing sets status + published_at via the repo update helper.
    if (body.status === 'published') {
      const published = await updateTierList(created.data.id, {
        status: 'published',
      });
      if (published.success && published.data) {
        return NextResponse.json(published, { status: 201 });
      }
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
