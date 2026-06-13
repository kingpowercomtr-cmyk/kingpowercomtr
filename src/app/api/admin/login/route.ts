import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ADMIN_TOKEN_SECRET = process.env.ADMIN_SECRET || "kingpower-admin-secret-2026";

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw + ADMIN_TOKEN_SECRET).digest("hex");
}

function generateToken(username: string) {
  const payload = Buffer.from(JSON.stringify({ username, ts: Date.now() })).toString("base64");
  const sig = crypto.createHmac("sha256", ADMIN_TOKEN_SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Kullanıcı adı ve şifre gereklidir." }, { status: 400 });
    }

    const result = await db.execute({
      sql: "SELECT * FROM AdminUser WHERE username = ?",
      args: [username],
    });

    const admin = result.rows[0] as any;
    if (!admin || admin.password !== hashPassword(password)) {
      return NextResponse.json({ error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
    }

    const token = generateToken(username);
    const cookieStore = await cookies();
    cookieStore.set("kp_admin_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Giriş yapılamadı." }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("kp_admin_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "strict",
  });
  return NextResponse.json({ success: true });
}