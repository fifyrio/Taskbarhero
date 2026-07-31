import { NextRequest, NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/lib/supabase-server';
import { voteTierList } from '@/lib/tier-lists';

export const dynamic = 'force-dynamic';

// POST /api/tier-lists/[id]/vote  { value: 1 | -1 }
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = (await request.json().catch(() => ({}))) as { value?: number };
    const value = body.value === -1 ? -1 : 1;

    const result = await voteTierList(params.id, user.id, value);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
