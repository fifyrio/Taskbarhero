import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/lib/search';

export const dynamic = 'force-dynamic';

export function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  try {
    const results = search(q, 24);
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
