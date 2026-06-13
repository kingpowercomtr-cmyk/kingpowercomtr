import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getPackage } from "@/lib/packages";

const PHONE_DIGIT_LENGTH = 10;

function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_DIGIT_LENGTH);
}

/** 10 hane, 5 ile başlar — örn. 5468823229 */
function isValidTurkishMobile(phone: string): boolean {
  const digits = sanitizePhoneInput(phone);
  return /^5\d{9}$/.test(digits);
}

function normalizePhone(phone: string): string {
  const digits = sanitizePhoneInput(phone);
  if (digits.startsWith("90") && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `+90${digits.slice(1)}`;
  }
  if (isValidTurkishMobile(digits)) {
    return `+90${digits}`;
  }
  throw new Error("Geçersiz telefon numarası.");
}

function generateOrderCode(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(100 + Math.random() * 900);
  return `KP-${datePart}-${rand}`;
}

interface CreateOrderInput {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  paymentType: string;
  packageType: string;
  status?: string;
}

async function createOrderRecord(input: CreateOrderInput) {
  const { fullName, phone, city, district, address, paymentType, packageType, status } = input;

  if (!fullName?.trim() || !phone?.trim() || !city || !district?.trim() || !address?.trim()) {
    throw new Error("Tüm teslimat alanları zorunludur.");
  }

  if (!paymentType || !["nakit", "kart"].includes(paymentType)) {
    throw new Error("Geçerli bir ödeme türü seçin.");
  }

  if (!isValidTurkishMobile(phone)) {
    throw new Error("Telefon 10 haneli olmalı ve 5 ile başlamalıdır. Örn: 5468823229");
  }

  const pkg = getPackage(String(packageType));
  if (!pkg) {
    throw new Error("Geçersiz paket seçimi.");
  }

  let code = generateOrderCode();
  let exists = await prisma.order.findUnique({ where: { code } });
  while (exists) {
    code = generateOrderCode();
    exists = await prisma.order.findUnique({ where: { code } });
  }

  return prisma.order.create({
    data: {
      code,
      fullName: fullName.trim(),
      phone: normalizePhone(phone),
      city,
      district: district.trim(),
      address: address.trim(),
      paymentType,
      packageType: pkg.key,
      packageLabel: pkg.packageLabel,
      price: pkg.price,
      status: status || "yeni_siparis",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await createOrderRecord(body);

    return NextResponse.json({
      success: true,
      code: order.code,
      order: {
        id: order.id,
        code: order.code,
        fullName: order.fullName,
        packageLabel: order.packageLabel,
        price: order.price,
        paymentType: order.paymentType,
      },
    });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    const status = message.includes("zorunlu") || message.includes("Geçersiz") || message.includes("Telefon") ? 400 : 500;
    return NextResponse.json(
      {
        error: status === 400 ? message : "Sipariş oluşturulamadı. Lütfen tekrar deneyin.",
        detail: process.env.NODE_ENV === "development" && status === 500 ? message : undefined,
      },
      { status }
    );
  }
}
