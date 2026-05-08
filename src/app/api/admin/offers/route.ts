import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const offers = await db.offer.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(offers);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const offer = await db.offer.create({ data: body });
    revalidatePath('/', 'layout');
    return NextResponse.json(offer, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}
