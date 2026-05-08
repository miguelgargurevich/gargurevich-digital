import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/db';

const PLAN_LABELS: Record<string, string> = {
  'starter-digital': 'Starter Digital (S/ 500)',
  'web-corporativa': 'Web Corporativa (S/ 700 – 900)',
  'web-corporativa-pro': 'Web Corporativa PRO + CMS (S/ 900 – 1200)',
  'negocio-digital-completo': 'Negocio Digital Completo (S/ 1200+)',
  otro: 'Otro / Sin definir',
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, projectType, message } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Sanitize inputs to prevent XSS in HTML email
    const sanitize = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const planLabel = PLAN_LABELS[projectType] ?? projectType;

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

    // 2. Send email notification via Resend
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.RESEND_TO_EMAIL;

    let emailSent = false;
    if (apiKey && fromEmail && toEmail) {
      const resend = new Resend(apiKey);
      const { error: resendErr } = await resend.emails.send({
        from: `Gargurevich Digital <${fromEmail}>`,
        to: [toEmail],
        subject: `🔔 Nuevo lead: ${sanitize(name)} — ${planLabel}`,
        replyTo: email,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#e5e5e5;border-radius:12px;overflow:hidden">
            <div style="background:linear-gradient(135deg,#00D4FF20,#8B5CF620);padding:28px 32px;border-bottom:1px solid #ffffff18">
              <h2 style="margin:0;font-size:20px;color:#fff">🔔 Nuevo Lead recibido</h2>
              <p style="margin:4px 0 0;font-size:13px;color:#71717A">${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })} (Lima)</p>
            </div>
            <div style="padding:28px 32px;display:grid;gap:12px">
              <p style="margin:0"><span style="color:#71717A;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Nombre</span><br><strong style="color:#fff">${sanitize(name)}</strong></p>
              <p style="margin:0"><span style="color:#71717A;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Email</span><br><a href="mailto:${sanitize(email)}" style="color:#00D4FF">${sanitize(email)}</a></p>
              ${company ? `<p style="margin:0"><span style="color:#71717A;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Empresa</span><br><strong style="color:#fff">${sanitize(company)}</strong></p>` : ''}
              <p style="margin:0"><span style="color:#71717A;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Plan / Tipo de Proyecto</span><br><strong style="color:#00D4FF">${planLabel}</strong></p>
              <p style="margin:0"><span style="color:#71717A;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Mensaje</span><br><span style="background:#111;display:block;padding:12px;border-radius:8px;margin-top:6px;white-space:pre-wrap;font-size:14px">${sanitize(message)}</span></p>
            </div>
            <div style="padding:20px 32px;border-top:1px solid #ffffff18;display:flex;gap:12px;flex-wrap:wrap">
              <a href="https://wa.me/${process.env.WHATSAPP_NUMBER ?? '51966918363'}?text=${encodeURIComponent(`Hola ${name}, vi tu mensaje sobre "${planLabel}". ¿Podemos hablar?`)}" style="background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">💬 Responder por WhatsApp</a>
              <a href="mailto:${sanitize(email)}?subject=Re: ${encodeURIComponent(`Tu consulta sobre ${planLabel}`)}" style="background:#00D4FF;color:#0a0a0a;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">✉️ Responder por Email</a>
            </div>
            ${leadId ? `<p style="padding:0 32px 20px;margin:0;font-size:11px;color:#52525B">Lead ID: ${leadId}</p>` : ''}
          </div>
        `,
      });
      if (resendErr) {
        console.error('Resend error:', resendErr);
      } else {
        emailSent = true;
      }
    } else {
      console.warn('Email env vars missing — skipping email notification');
    }

    return NextResponse.json({ success: true, leadId, emailSent });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error interno';
    console.error('Contact API error:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
