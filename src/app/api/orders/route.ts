import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPackage } from "@/lib/packages";

const PHONE_DIGIT_LENGTH = 10;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000; // 5 dakika

function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_DIGIT_LENGTH);
}

function isValidTurkishMobile(phone: string): boolean {
  const digits = sanitizePhoneInput(phone);
  return /^5\d{9}$/.test(digits);
}

function normalizePhone(phone: string): string {
  const digits = sanitizePhoneInput(phone);
  if (digits.startsWith("90") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `+90${digits.slice(1)}`;
  if (isValidTurkishMobile(digits)) return `+90${digits}`;
  throw new Error("Geçersiz telefon numarası.");
}

function generateOrderCode(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(100 + Math.random() * 900);
  return `KP-${datePart}-${rand}`;
}

/** SQLite CURRENT_TIMESTAMP formatına uygun "YYYY-MM-DD HH:MM:SS" string üretir (UTC) */
function sqliteTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, city, district, address, paymentType, packageType } = body;

    if (!fullName?.trim() || !phone?.trim() || !city || !district?.trim() || !address?.trim()) {
      return NextResponse.json({ error: "Tüm teslimat alanları zorunludur." }, { status: 400 });
    }
    if (!paymentType || !["nakit", "kart"].includes(paymentType)) {
      return NextResponse.json({ error: "Geçerli bir ödeme türü seçin." }, { status: 400 });
    }
    if (!isValidTurkishMobile(phone)) {
      return NextResponse.json({ error: "Telefon 10 haneli olmalı ve 5 ile başlamalıdır." }, { status: 400 });
    }

    const pkg = getPackage(String(packageType));
    if (!pkg) {
      return NextResponse.json({ error: "Geçersiz paket seçimi." }, { status: 400 });
    }

    const normalizedPhone = normalizePhone(phone);
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

    // Mükerrer sipariş kontrolü: son 5 dakika içinde aynı telefon veya aynı IP'den sipariş var mı?
    const since = sqliteTimestamp(new Date(Date.now() - DUPLICATE_WINDOW_MS));
    let duplicateCheck;
    try {
      duplicateCheck = await db.execute({
        sql: `SELECT code FROM "Order" WHERE (phone = ? OR (ip = ? AND ip != 'unknown')) AND createdAt >= ? LIMIT 1`,
        args: [normalizedPhone, ip, since],
      });
    } catch {
      // ip kolonu henüz migrate edilmemiş olabilir - sadece telefon kontrolü yap
      duplicateCheck = await db.execute({
        sql: `SELECT code FROM "Order" WHERE phone = ? AND createdAt >= ? LIMIT 1`,
        args: [normalizedPhone, since],
      });
    }


    if (duplicateCheck.rows.length > 0) {
      const existingCode = (duplicateCheck.rows[0] as any).code;
      return NextResponse.json(
        { error: "Siparişiniz zaten alındı. Lütfen kısa süre sonra tekrar deneyin.", code: existingCode, duplicate: true },
        { status: 409 }
      );
    }

    let code = generateOrderCode();
    let exists = await db.execute({ sql: `SELECT id FROM "Order" WHERE code = ?`, args: [code] });
    while (exists.rows.length > 0) {
      code = generateOrderCode();
      exists = await db.execute({ sql: `SELECT id FROM "Order" WHERE code = ?`, args: [code] });
    }

    try {
      await db.execute({
        sql: `INSERT INTO "Order" (code, fullName, phone, city, district, address, paymentType, packageType, packageLabel, price, status, ip, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'yeni_siparis', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: [code, fullName.trim(), normalizedPhone, city, district.trim(), address.trim(), paymentType, pkg.key, pkg.packageLabel, pkg.price, ip],
      });
    } catch {
      // ip kolonu henüz migrate edilmemiş olabilir - eski şema ile dene
      await db.execute({
        sql: `INSERT INTO "Order" (code, fullName, phone, city, district, address, paymentType, packageType, packageLabel, price, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'yeni_siparis', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: [code, fullName.trim(), normalizedPhone, city, district.trim(), address.trim(), paymentType, pkg.key, pkg.packageLabel, pkg.price],
      });
    }


    return NextResponse.json({ success: true, code, order: { code, fullName, packageLabel: pkg.packageLabel, price: pkg.price, paymentType } });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: "Sipariş oluşturulamadı." }, { status: 500 });
  }
}
