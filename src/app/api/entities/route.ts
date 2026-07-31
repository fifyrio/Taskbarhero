import { NextRequest, NextResponse } from 'next/server';
import { getEntitiesByGame } from '@/lib/tier-lists';

export const dynamic = 'force-dynamic';

// GET /api/entities?gameId=... — public-read list of entities for a game.
export async function GET(request: NextRequest) {
  try {
    const gameId = request.nextUrl.searchParams.get('gameId');
    if (!gameId) {
      return NextResponse.json(
        { success: false, error: 'gameId é obrigatório' },
        { status: 400 }
      );
    }

    const result = await getEntitiesByGame(gameId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error';
    return NextResponse.json({ success: false, error: message }, { status: 200 });
  }
}
