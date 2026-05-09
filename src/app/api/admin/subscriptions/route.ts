import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { activateSetupWithGrace } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

const asOptionalString = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  const v = value.trim();
  return v.length > 0 ? v : null;
};

const asOptionalAmount = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export async function GET() {
  const rows = await db.clientSite.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      renewals: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body.slug || '').trim();
    const businessName = String(body.businessName || '').trim();

    if (!slug || !businessName) {
      return NextResponse.json({ error: 'slug and businessName are required' }, { status: 400 });
    }

    let site;
    try {
      site = await db.clientSite.create({
        data: {
          slug,
          businessName,
          contractedService: asOptionalString(body.contractedService),
          serviceTier: asOptionalString(body.serviceTier),
          setupFeeAmount: asOptionalAmount(body.setupFeeAmount),
          recurringAmount: asOptionalAmount(body.recurringAmount),
          currency: asOptionalString(body.currency)?.toUpperCase() || 'PEN',
          billingEmail: asOptionalString(body.billingEmail),
          billingContactName: asOptionalString(body.billingContactName),
          billingContactPhone: asOptionalString(body.billingContactPhone),
          notes: asOptionalString(body.notes),
        },
      });
    } catch (e) {
      const error = e as any;
      if (error.code === 'P2002') {
        const target = error.meta?.target?.[0];
        if (target === 'slug') {
          return NextResponse.json({ error: `El slug "${slug}" ya está en uso` }, { status: 409 });
        }
      }
      throw e;
    }

    const activated = await activateSetupWithGrace({
      clientSiteId: site.id,
    });

    return NextResponse.json(activated, { status: 201 });
  } catch (err) {
    console.error('Error creating subscription:', err);
    const message = err instanceof Error ? err.message : 'Failed to create subscription site';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
