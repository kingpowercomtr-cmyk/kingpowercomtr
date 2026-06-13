import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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
  const [visits, total] = await Promise.all([
    prisma.visit.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.visit.count(),
  ]);
  return NextResponse.json({ visits, total });
}
