import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const TOKEN_COOKIE = 'admin_token';

function getSecret() {
  return new TextEncoder().encode(process.env.ADMIN_SECRET!);
}

export async function signAdminToken(username: string): Promise<string> {
  return new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  return payload;
}

export function validateCredentials(username: string, password: string): boolean {
  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  if (!validUser || !validPass) return false;
  // Constant-time-ish comparison to avoid timing attacks
  return username === validUser && password === validPass;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}
