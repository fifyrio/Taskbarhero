import { NextResponse } from 'next/server';
import { getGames } from '@/lib/tier-lists';

export const dynamic = 'force-dynamic';

// GET /api/games — public-read list of active games.
export async function GET() {
  try {
    const result = await getGames();
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ success: false, error: message }, { status: 200 });
  }
}
