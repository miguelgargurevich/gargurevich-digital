import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const isDevelopment = process.env.NODE_ENV !== 'production';
const localDbUrl = process.env.LOCAL_DATABASE_URL;

export const db =
  globalForPrisma.prisma ??
  new PrismaClient(
    isDevelopment && localDbUrl
      ? { datasources: { db: { url: localDbUrl } } }
      : undefined
  );

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
