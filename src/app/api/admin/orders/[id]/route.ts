import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ORDER_STATUS_VALUES, CARGO_COMPANIES } from "@/lib/order-status";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const { id } = await params;
  const orderId = parseInt(id, 10);
  if (Number.isNaN(orderId)) {
    return NextResponse.json({ error: "Geçersiz sipariş." }, { status: 400 });
  }

  const body = await req.json();
  const { status, note, cargoCompany, trackingCode } = body;

  if (status && !ORDER_STATUS_VALUES.includes(status)) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  const setParts: string[] = ["updatedAt = CURRENT_TIMESTAMP"];
  const args: any[] = [];

  if (status) { setParts.push("status = ?"); args.push(status); }
  if (note !== undefined) { setParts.push("note = ?"); args.push(note); }
  if (cargoCompany !== undefined) { setParts.push("cargoCompany = ?"); args.push(cargoCompany || null); }
  if (trackingCode !== undefined) { setParts.push("trackingCode = ?"); args.push(trackingCode?.trim() || null); }

  args.push(orderId);

  await db.execute({ sql: `UPDATE "Order" SET ${setParts.join(", ")} WHERE id = ?`, args });

  const result = await db.execute({ sql: `SELECT * FROM "Order" WHERE id = ?`, args: [orderId] });
  return NextResponse.json({ success: true, order: result.rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const { id } = await params;
  const orderId = parseInt(id, 10);
  if (Number.isNaN(orderId)) {
    return NextResponse.json({ error: "Geçersiz sipariş." }, { status: 400 });
  }

  try {
    await db.execute({ sql: `DELETE FROM "Order" WHERE id = ?`, args: [orderId] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sipariş silinemedi." }, { status: 404 });
  }
}
