import { SignJWT, jwtVerify } from "jose";

export function verifyAdminPassword(password: string, envPassword: string): boolean {
  if (!envPassword) return false;
  return password === envPassword;
}

// Password Hashing (SHA-256 + Salt)
function generateSalt(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(password: string, providedSalt?: string): Promise<string> {
  const salt = providedSalt || generateSalt();
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${salt}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, originalHash] = storedHash.split(":");
  const [, newHash] = (await hashPassword(password, salt)).split(":");
  return originalHash === newHash;
}

// JWT Authentication
function getJwtSecret() {
  const secret = process.env.JWT_SECRET || "mcu-watchpath-fallback-secret-key-development-secure";
  return new TextEncoder().encode(secret);
}

export async function signUserToken(userId: number, email: string) {
  return await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifyUserToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as { userId: number; email: string };
  } catch (err) {
    return null;
  }
}
