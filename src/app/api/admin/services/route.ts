import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await db.service.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const service = await db.service.create({
      data: {
        slug: body.slug,
        icon: body.icon ?? 'code',
        titleEs: body.titleEs,
        titleEn: body.titleEn,
        descriptionEs: body.descriptionEs,
        descriptionEn: body.descriptionEn,
        featuresEs: body.featuresEs ?? [],
        featuresEn: body.featuresEn ?? [],
        order: body.order ?? 0,
        published: body.published !== false,
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
