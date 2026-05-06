import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await db.portfolioProject.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(projects);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await db.portfolioProject.create({
      data: {
        slug: body.slug,
        titleEs: body.titleEs,
        titleEn: body.titleEn,
        descriptionEs: body.descriptionEs,
        descriptionEn: body.descriptionEn,
        featuresEs: body.featuresEs ?? [],
        featuresEn: body.featuresEn ?? [],
        tech: body.tech ?? [],
        github: body.github ?? '#',
        live: body.live ?? '#',
        color: body.color ?? '#00D4FF',
        imageUrl: body.imageUrl ?? null,
        order: body.order ?? 0,
        published: body.published !== false,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
