import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { activateSetupWithGrace, ensureActiveSubscription, refreshSubscriptionStatus } from '@/lib/subscription';

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
