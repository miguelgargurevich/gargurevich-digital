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

      const slug = formData.get('slug') as string | null;
      
      const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? 'bin';
      const originalName = file.name
        .split('.')
        .slice(0, -1)
        .join('.')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      
      // Use slug if provided, otherwise fallback to original name
      const baseName = slug ? slug.toLowerCase().replace(/[^a-z0-9]/g, '-') : originalName;
      const safeName = `${baseName}-${Date.now()}.${ext}`;
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
