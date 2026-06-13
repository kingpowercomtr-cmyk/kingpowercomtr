import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { STATUS_LABELS, ORDER_STATUS_VALUES } from "@/lib/order-status";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50", 10);
  const status = req.nextUrl.searchParams.get("status");
  const exportCsv = req.nextUrl.searchParams.get("export") === "csv";
  const offset = (page - 1) * limit;

  const whereClause = status ? `WHERE status = ?` : "";
  const args = status ? [status] : [];

  if (exportCsv) {
    const result = await db.execute({ sql: `SELECT * FROM "Order" ${whereClause} ORDER BY createdAt DESC`, args });
    const orders = result.rows as any[];

    const header = ["Sipariş Kodu","Ad Soyad","Telefon","Şehir","İlçe","Adres","Paket","Tutar","Ödeme","Durum","Kargo Firması","Takip Kodu","Tarih"];
    const rows = orders.map((o) => [
      o.code, o.fullName, o.phone, o.city, o.district, o.address.replace(/\n/g, " "),
      o.packageLabel, String(o.price), o.paymentType === "nakit" ? "Kapıda Nakit" : "Kapıda Kart",
      STATUS_LABELS[o.status] || o.status, o.cargoCompany || "", o.trackingCode || "",
      new Date(o.createdAt).toLocaleString("tr-TR"),
    ]);

    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    return new NextResponse("\uFEFF" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="kingpower-siparisler-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const [ordersResult, countResult] = await Promise.all([
    db.execute({ sql: `SELECT * FROM "Order" ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`, args: [...args, limit, offset] }),
    db.execute({ sql: `SELECT COUNT(*) as count FROM "Order" ${whereClause}`, args }),
  ]);

  return NextResponse.json({ orders: ordersResult.rows, total: Number((countResult.rows[0] as any)?.count ?? 0), page, limit });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, code, fullName, phone, city, district, address, paymentType, packageType, packageLabel, price } = body;
    const orderCode = code || `KP-${Math.floor(100000 + Math.random() * 900000)}`;

    await db.execute({
      sql: `INSERT INTO "Order" (code, fullName, phone, city, district, address, paymentType, packageType, packageLabel, price, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [orderCode, fullName, phone, city, district, address, paymentType, packageType, packageLabel, price, status || "beklemede"],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sipariş eklenemedi.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
