import { SubscriptionStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    const now = new Date();

    const result = await db.clientSite.updateMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        OR: [
          { subscriptionEndsAt: null },
          { subscriptionEndsAt: { lt: now } },
        ],
      },
      data: {
        status: SubscriptionStatus.INACTIVE,
        deactivatedAt: now,
        deactivationReason: 'Subscription expired',
      },
    });

    return NextResponse.json({ ok: true, deactivated: result.count });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to expire subscriptions' }, { status: 500 });
  }
}
