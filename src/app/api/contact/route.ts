import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, projectType, message } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // 1. Save lead in DB (never fails the request if DB is down)
    let leadId: string | null = null;
    try {
      const lead = await db.lead.create({
        data: {
          name,
          email,
          company: company || null,
          projectType,
          message,
        },
      });
      leadId = lead.id;
    } catch (dbErr) {
      console.error('Lead DB save error:', dbErr);
    }

    return NextResponse.json({ success: true, leadId, emailSent: false });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno';
    console.error('Contact API error:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
