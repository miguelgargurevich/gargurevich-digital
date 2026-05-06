import { NextRequest, NextResponse } from 'next/server';
import { getUploadPresignedUrl } from '@/lib/r2';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Finalize upload: only register in DB after client confirms successful PUT to R2.
    if (body?.finalize === true) {
      const key = typeof body.key === 'string' ? body.key : '';
      const filename = typeof body.filename === 'string' ? body.filename : 'file';
      const contentType = typeof body.contentType === 'string' ? body.contentType : 'application/octet-stream';
      const size = typeof body.size === 'number' ? body.size : 0;

      if (!key || !key.startsWith('projects/')) {
        return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
      }

      const base = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
      const publicUrl = `${base}/${key}`;

      const media = await db.mediaFile.upsert({
        where: { key },
        update: {
          filename: filename.slice(0, 255),
          url: publicUrl,
          size,
          mimeType: contentType.slice(0, 100),
        },
        create: {
          filename: filename.slice(0, 255),
          key,
          url: publicUrl,
          size,
          mimeType: contentType.slice(0, 100),
        },
      });

      return NextResponse.json({ ok: true, media });
    }

    const filename = body?.filename;
    const contentType = body?.contentType;
    const size = body?.size;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    // Sanitize: generate a unique key to avoid overwrites / path traversal
    const ext = filename.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') ?? 'bin';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const key = `projects/${safeName}`;

    const { uploadUrl, publicUrl } = await getUploadPresignedUrl(key, contentType);

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
