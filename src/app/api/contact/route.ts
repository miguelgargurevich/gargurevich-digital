import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, company, projectType, message } = await req.json();

    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Gargurevich Digital <onboarding@resend.dev>',
      to: ['contacto@gargurevich.dev'],
      subject: `Nuevo mensaje de contacto: ${projectType}`,
      replyTo: email,
      html: `
        <h2>Nuevo mensaje desde el sitio web</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company || 'N/A'}</p>
        <p><strong>Tipo de Proyecto:</strong> ${projectType}</p>
        <p><strong>Mensaje:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${message.replace(/\n/g, '<br>') || 'N/A'}
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Error interno al enviar el mensaje' },
      { status: 500 }
    );
  }
}
