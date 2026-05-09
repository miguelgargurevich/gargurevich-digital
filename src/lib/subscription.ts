import { RenewalPlan, SubscriptionStatus } from '@prisma/client';
import { db } from '@/lib/db';

const DEFAULT_GRACE_MONTHS = 12;

function addMonths(from: Date, months: number): Date {
  // Robust month addition that handles timezone and day-of-month edge cases
  const year = from.getFullYear();
  const month = from.getMonth() + months;
  const day = from.getDate();

  // Calculate target year and month (handle overflow)
  const targetYear = year + Math.floor(month / 12);
  const targetMonth = month % 12;

  // Create date in target year/month, then adjust day if needed
  // (e.g., Jan 31 + 1 month = Feb 28/29, not Mar 3)
  const result = new Date(targetYear, targetMonth, day);

  // If the day rolled over to next month, go back to last day of target month
  if (result.getMonth() !== targetMonth) {
    result.setDate(0); // Last day of previous month
  }

  // Preserve time components from original date
  result.setHours(from.getHours(), from.getMinutes(), from.getSeconds(), from.getMilliseconds());

  return result;
}

function getPlanMonths(plan: RenewalPlan): number {
  return plan === RenewalPlan.MONTHLY ? 1 : 12;
}

function getDiscountPercent(plan: RenewalPlan): number {
  if (plan === RenewalPlan.ANNUAL_10) return 10;
  if (plan === RenewalPlan.ANNUAL_15) return 15;
  return 0;
}

function applyDiscount(amount: number, discountPercent: number): number {
  const discounted = amount * (1 - discountPercent / 100);
  return Math.round(discounted * 100) / 100;
}

export async function activateSetupWithGrace(params: {
  clientSiteId: string;
  activatedAt?: Date;
}) {
  const activatedAt = params.activatedAt ?? new Date();
  const endsAt = addMonths(activatedAt, DEFAULT_GRACE_MONTHS);

  return db.clientSite.update({
    where: { id: params.clientSiteId },
    data: {
      status: SubscriptionStatus.ACTIVE,
      setupFeePaidAt: activatedAt,
      subscriptionStartsAt: activatedAt,
      subscriptionEndsAt: endsAt,
      graceIncludedMonths: DEFAULT_GRACE_MONTHS,
      deactivatedAt: null,
      deactivationReason: null,
      lastRenewalPlan: null,
    },
  });
}

export async function renewSubscription(params: {
  clientSiteId: string;
  plan: RenewalPlan;
  amount?: number;
  paidAt?: Date;
}) {
  const paidAt = params.paidAt ?? new Date();
  const site = await db.clientSite.findUnique({ where: { id: params.clientSiteId } });
  if (!site) throw new Error('Client site not found');

  const baseDate = site.subscriptionEndsAt && site.subscriptionEndsAt > paidAt
    ? site.subscriptionEndsAt
    : paidAt;

  const startsAt = baseDate;
  const endsAt = addMonths(baseDate, getPlanMonths(params.plan));
  const discountPercent = getDiscountPercent(params.plan);
  const fallbackAmount =
    site.recurringAmount != null
      ? applyDiscount(Number(site.recurringAmount), discountPercent)
      : undefined;
  const resolvedAmount = params.amount ?? fallbackAmount;

  await db.subscriptionRenewal.create({
    data: {
      clientSiteId: params.clientSiteId,
      plan: params.plan,
      discountPercent,
      amount: resolvedAmount,
      startsAt,
      endsAt,
    },
  });

  return db.clientSite.update({
    where: { id: params.clientSiteId },
    data: {
      status: SubscriptionStatus.ACTIVE,
      subscriptionEndsAt: endsAt,
      lastRenewalPlan: params.plan,
      deactivatedAt: null,
      deactivationReason: null,
    },
  });
}

export async function refreshSubscriptionStatus(clientSiteId: string, now = new Date()) {
  const site = await db.clientSite.findUnique({ where: { id: clientSiteId } });
  if (!site) return null;

  if (!site.subscriptionEndsAt || site.subscriptionEndsAt < now) {
    return db.clientSite.update({
      where: { id: clientSiteId },
      data: {
        status: SubscriptionStatus.INACTIVE,
        deactivatedAt: now,
        deactivationReason: 'Subscription expired',
      },
    });
  }

  if (site.status !== SubscriptionStatus.ACTIVE) {
    return db.clientSite.update({
      where: { id: clientSiteId },
      data: {
        status: SubscriptionStatus.ACTIVE,
        deactivatedAt: null,
        deactivationReason: null,
      },
    });
  }

  return site;
}

export async function ensureActiveSubscription(clientSiteId: string) {
  const site = await refreshSubscriptionStatus(clientSiteId);

  if (!site || site.status !== SubscriptionStatus.ACTIVE) {
    const error = new Error('Subscription inactive');
    (error as Error & { code?: string }).code = 'SUBSCRIPTION_INACTIVE';
    throw error;
  }

  return site;
}
