import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is missing');
      return NextResponse.json({ error: 'Configuración del servidor incompleta' }, { status: 500 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.RESEND_TO_EMAIL;
    if (!fromEmail || !toEmail) {
      console.error('RESEND_FROM_EMAIL or RESEND_TO_EMAIL is missing');
      return NextResponse.json({ error: 'Configuración del servidor incompleta' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const body = await req.json();
    console.log('Contact form body:', body);
    const { name, email, company, projectType, message } = body;

    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    console.log('Sending email via Resend...');
    const { data, error } = await resend.emails.send({
      from: `Gargurevich Digital <${fromEmail}>`,
      to: [toEmail],
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
      console.error('Resend Error Details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || 'Error de Resend' }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Contact API Unexpected Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno al enviar el mensaje' },
      { status: 500 }
    );
  }
}
