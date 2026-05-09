import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { activateSetupWithGrace, ensureActiveSubscription, refreshSubscriptionStatus } from '@/lib/subscription';

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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const refreshed = await refreshSubscriptionStatus(id);
  if (!refreshed) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const withHistory = await db.clientSite.findUnique({
    where: { id },
    include: {
      renewals: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return NextResponse.json(withHistory);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.action === 'activate_setup') {
      const updated = await activateSetupWithGrace({ clientSiteId: id });
      return NextResponse.json(updated);
    }

    if (body.action === 'check_access') {
      try {
        const site = await ensureActiveSubscription(id);
        return NextResponse.json({ ok: true, status: site.status, subscriptionEndsAt: site.subscriptionEndsAt });
      } catch {
        return NextResponse.json({ ok: false, error: 'Subscription inactive' }, { status: 403 });
      }
    }

    const data: Record<string, unknown> = {};
    if (typeof body.businessName === 'string') {
      data.businessName = body.businessName.trim();
    }
    if (typeof body.slug === 'string') {
      data.slug = body.slug.trim();
    }
    if (body.contractedService !== undefined) {
      data.contractedService = asOptionalString(body.contractedService);
    }
    if (body.serviceTier !== undefined) {
      data.serviceTier = asOptionalString(body.serviceTier);
    }
    if (body.setupFeeAmount !== undefined) {
      data.setupFeeAmount = asOptionalAmount(body.setupFeeAmount);
    }
    if (body.recurringAmount !== undefined) {
      data.recurringAmount = asOptionalAmount(body.recurringAmount);
    }
    if (body.currency !== undefined) {
      data.currency = asOptionalString(body.currency)?.toUpperCase() || 'PEN';
    }
    if (body.billingEmail !== undefined) {
      data.billingEmail = asOptionalString(body.billingEmail);
    }
    if (body.billingContactName !== undefined) {
      data.billingContactName = asOptionalString(body.billingContactName);
    }
    if (body.billingContactPhone !== undefined) {
      data.billingContactPhone = asOptionalString(body.billingContactPhone);
    }
    if (body.notes !== undefined) {
      data.notes = asOptionalString(body.notes);
    }

    const updated = await db.clientSite.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update subscription site' }, { status: 500 });
  }
}
