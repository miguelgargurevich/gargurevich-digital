import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const offers = await db.offer.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(offers);
  } catch (error) {
    console.error('[GET /api/offers/published]', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}
