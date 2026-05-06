import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

function getClient() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadToR2(key: string, contentType: string, body: Buffer) {
  const s3 = getClient();
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: contentType,
    Body: body,
  }));
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
  return { publicUrl };
}

export async function listR2Files(prefix?: string) {
  const s3 = getClient();
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET!,
    Prefix: prefix,
    MaxKeys: 200,
  });
  const response = await s3.send(command);
  return response.Contents ?? [];
}

export async function deleteR2File(key: string) {
  const s3 = getClient();
  await s3.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }));
}
