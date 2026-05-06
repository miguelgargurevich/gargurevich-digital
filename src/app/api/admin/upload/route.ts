import { NextRequest, NextResponse } from 'next/server';
import { getUploadPresignedUrl } from '@/lib/r2';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, size } = await request.json();

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

    // Register in media library
    await db.mediaFile.create({
      data: {
        filename: filename.slice(0, 255),
        key,
        url: publicUrl,
        size: typeof size === 'number' ? size : 0,
        mimeType: contentType.slice(0, 100),
      },
    });

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
