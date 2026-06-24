import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

// Storage S3-compatible. Soporta MinIO (S3_* con endpoint propio + path-style)
// y Cloudflare R2 (R2_* como fallback). Para MinIO definir:
//   S3_ENDPOINT=https://s3.gargurevich.dev  S3_PATH_STYLE=true
//   S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY / S3_BUCKET / S3_PUBLIC_URL

function resolveEndpoint(): string {
  const raw = process.env.S3_ENDPOINT || process.env.R2_ENDPOINT;
  if (raw) return raw.startsWith('http') ? raw : `https://${raw}`;
  // Fallback: endpoint estilo Cloudflare R2 derivado del account id.
  return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
}

function bucket(): string {
  return (process.env.S3_BUCKET || process.env.R2_BUCKET)!;
}

function publicBase(): string | undefined {
  return process.env.S3_PUBLIC_URL || process.env.R2_PUBLIC_URL;
}

function getClient() {
  return new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: resolveEndpoint(),
    // MinIO requiere path-style (bucket en el path, no en el subdominio).
    forcePathStyle: (process.env.S3_PATH_STYLE || process.env.R2_PATH_STYLE) === 'true',
    credentials: {
      accessKeyId: (process.env.S3_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID)!,
      secretAccessKey: (process.env.S3_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY)!,
    },
  });
}

export async function uploadToR2(key: string, contentType: string, body: Buffer) {
  const s3 = getClient();
  await s3.send(new PutObjectCommand({
    Bucket: bucket(),
    Key: key,
    ContentType: contentType,
    Body: body,
  }));
  const publicUrl = `${publicBase()}/${key}`;
  return { publicUrl };
}

export async function listR2Files(prefix?: string) {
  const s3 = getClient();
  const command = new ListObjectsV2Command({
    Bucket: bucket(),
    Prefix: prefix,
    MaxKeys: 200,
  });
  const response = await s3.send(command);
  return response.Contents ?? [];
}

export async function deleteR2File(key: string) {
  const s3 = getClient();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
