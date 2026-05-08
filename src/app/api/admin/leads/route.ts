import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? undefined;
  const q = searchParams.get('q')?.trim() ?? '';
  const sort = searchParams.get('sort') ?? 'createdAt';
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = 20;

  const where = {
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

  const orderBy: Prisma.LeadOrderByWithRelationInput =
    sort === 'name'
      ? { name: sortOrder }
      : sort === 'status'
        ? { status: sortOrder }
        : { createdAt: sortOrder };

  const [leads, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.lead.count({ where }),
  ]);

  return NextResponse.json({ leads, total, page, pages: Math.ceil(total / limit) });
}
