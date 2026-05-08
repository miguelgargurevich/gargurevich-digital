import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? undefined;
  const q = searchParams.get('q')?.trim() ?? '';
  const cursor = searchParams.get('cursor') ?? undefined;
  const sort = searchParams.get('sort') ?? 'createdAt';
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));

  const where: Prisma.LeadWhereInput = {
    ...(status ? { status: status as never } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
            { company: { contains: q, mode: 'insensitive' as const } },
            { projectType: { contains: q, mode: 'insensitive' as const } },
            { message: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const sortOrder: Prisma.SortOrder = order;

  const orderBy: Prisma.LeadOrderByWithRelationInput[] =
    sort === 'name'
      ? [{ name: sortOrder }, { id: sortOrder }]
      : sort === 'status'
        ? [{ status: sortOrder }, { createdAt: 'desc' }, { id: 'desc' }]
        : [{ createdAt: sortOrder }, { id: sortOrder }];

  const [rawLeads, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit + 1,
    }),
    db.lead.count({ where }),
  ]);

  const hasMore = rawLeads.length > limit;
  const leads = hasMore ? rawLeads.slice(0, limit) : rawLeads;
  const nextCursor = hasMore ? leads[leads.length - 1]?.id ?? null : null;

  return NextResponse.json({
    leads,
    total,
    limit,
    hasMore,
    nextCursor,
    pages: Math.ceil(total / limit),
  });
}
