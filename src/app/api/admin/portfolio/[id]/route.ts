import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await db.portfolioProject.findUnique({ where: { id } });
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const project = await db.portfolioProject.update({
      where: { id },
      data: {
        titleEs: body.titleEs,
        titleEn: body.titleEn,
        descriptionEs: body.descriptionEs,
        descriptionEn: body.descriptionEn,
        featuresEs: body.featuresEs,
        featuresEn: body.featuresEn,
        tech: body.tech,
        github: body.github,
        live: body.live,
        color: body.color,
        imageUrl: body.imageUrl ?? null,
        order: body.order,
        published: body.published,
      },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.portfolioProject.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
