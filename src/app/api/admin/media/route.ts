import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { deleteR2File } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const files = await db.mediaFile.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return NextResponse.json(files);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { key } = await request.json();
    await deleteR2File(key);
    await db.mediaFile.delete({ where: { key } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
