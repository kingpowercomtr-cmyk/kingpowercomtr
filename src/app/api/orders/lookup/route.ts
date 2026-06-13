import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { STATUS_LABELS } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code")?.trim();
    if (!code) {
      return NextResponse.json({ error: "Sipariş kodu gereklidir." }, { status: 400 });
    }

    const result = await db.execute({
      sql: `SELECT * FROM "Order" WHERE code = ?`,
      args: [code.toUpperCase()],
    });

    const order = result.rows[0] as any;
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
