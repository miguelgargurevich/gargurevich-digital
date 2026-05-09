import { RenewalPlan } from '@prisma/client';
import { NextResponse } from 'next/server';
import { renewSubscription } from '@/lib/subscription';

function parsePlan(value: string): RenewalPlan | null {
  if (value === RenewalPlan.MONTHLY) return RenewalPlan.MONTHLY;
  if (value === RenewalPlan.ANNUAL_10) return RenewalPlan.ANNUAL_10;
  if (value === RenewalPlan.ANNUAL_15) return RenewalPlan.ANNUAL_15;
  return null;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const plan = parsePlan(String(body.plan || ''));

    if (!plan) {
      return NextResponse.json(
        { error: 'plan is required. Use MONTHLY, ANNUAL_10 or ANNUAL_15' },
        { status: 400 }
      );
    }

    const amount = typeof body.amount === 'number' ? body.amount : undefined;

    const updated = await renewSubscription({
      clientSiteId: id,
      plan,
      amount,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to renew subscription' }, { status: 500 });
  }
}
