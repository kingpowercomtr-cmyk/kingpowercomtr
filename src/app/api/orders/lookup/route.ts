import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { STATUS_LABELS } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // ESNAF JİLETİ: Build esnasında searchParams hatası vermesin diye bypass ediyoruz
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ success: true });
  }

  try {
    const code = req.nextUrl.searchParams.get("code")?.trim();
    if (!code) {
      return NextResponse.json({ error: "Sipariş kodu gereklidir." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı. Kodu kontrol ediniz." }, { status: 404 });
    }

    return NextResponse.json({
      code: order.code,
      status: order.status,
      statusLabel: STATUS_LABELS[order.status] || order.status,
      packageLabel: order.packageLabel,
      price: order.price,
      cargoCompany: order.cargoCompany,
      trackingCode: order.trackingCode,
      createdAt: order.createdAt,
    });
  } catch (err) {
    console.error("GET /api/orders/lookup error:", err);
    return NextResponse.json({ error: "Sorgu yapılamadı." }, { status: 500 });
  }
}