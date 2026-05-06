import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

export async function getUploadPresignedUrl(key: string, contentType: string) {
  const s3 = getClient();
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
  return { uploadUrl, publicUrl };
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
