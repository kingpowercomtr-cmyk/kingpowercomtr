import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_TOKEN_SECRET = process.env.ADMIN_SECRET || "kingpower-admin-secret-2026";

function verifyToken(token: string): boolean {
  try {
    const [payload, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", ADMIN_TOKEN_SECRET).update(payload).digest("hex");
    return sig === expected;
  } catch { return false; }
}

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("kp_admin_token")?.value;
  return !!token && verifyToken(token);
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = 50;
  const offset = (page - 1) * limit;

  const [visitsResult, countResult] = await Promise.all([
    db.execute({ sql: `SELECT * FROM Visit ORDER BY createdAt DESC LIMIT ? OFFSET ?`, args: [limit, offset] }),
    db.execute({ sql: `SELECT COUNT(*) as count FROM Visit`, args: [] }),
  ]);

  return NextResponse.json({ visits: visitsResult.rows, total: Number((countResult.rows[0] as any)?.count ?? 0) });
}
