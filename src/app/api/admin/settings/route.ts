import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await db.siteSetting.findMany();
    const result: Record<string, string> = {};
    for (const row of rows) result[row.key] = row.value;
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        db.siteSetting.upsert({
          where: { key },
          update: { value, updatedAt: new Date() },
          create: { key, value, updatedAt: new Date() },
        })
      )
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
