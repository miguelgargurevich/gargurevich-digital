import { NextRequest, NextResponse } from 'next/server';
import { uploadToR2 } from '@/lib/r2';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') ?? 'bin';
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const key = `projects/${safeName}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      const { publicUrl } = await uploadToR2(key, file.type, buffer);

      const media = await db.mediaFile.upsert({
        where: { key },
        update: {
          filename: file.name.slice(0, 255),
          url: publicUrl,
          size: file.size,
          mimeType: file.type.slice(0, 100),
        },
        create: {
          filename: file.name.slice(0, 255),
          key,
          url: publicUrl,
          size: file.size,
          mimeType: file.type.slice(0, 100),
        },
      });

      return NextResponse.json({ ok: true, publicUrl, key, media });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
