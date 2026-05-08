import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LeadStatus } from '@prisma/client';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const allowedStatuses = Object.values(LeadStatus) as string[];
  const data: { status?: LeadStatus; notes?: string } = {};

  if (body.status !== undefined) {
    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }
    data.status = body.status as LeadStatus;
  }
  if (body.notes !== undefined) {
    data.notes = String(body.notes);
  }

  const lead = await db.lead.update({ where: { id }, data });
  return NextResponse.json(lead);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
