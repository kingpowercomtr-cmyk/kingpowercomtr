import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_TOKEN_SECRET = process.env.ADMIN_SECRET || "kingpower-admin-secret-2026";

export function verifyAdminToken(token: string): boolean {
  try {
    const [payload, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", ADMIN_TOKEN_SECRET).update(payload).digest("hex");
    return sig === expected;
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("kp_admin_token")?.value;
  return !!token && verifyAdminToken(token);
}
