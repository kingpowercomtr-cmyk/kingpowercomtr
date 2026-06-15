import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ORDER_STATUS_VALUES } from "@/lib/order-status";
import { getPackage } from "@/lib/packages";

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
  const {
    status, note, cargoCompany, trackingCode,
    fullName, phone, address, city, district, packageType, paymentType,
  } = body;

  if (status && !ORDER_STATUS_VALUES.includes(status)) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  if (paymentType && !["nakit", "kart"].includes(paymentType)) {
    return NextResponse.json({ error: "Geçersiz ödeme türü." }, { status: 400 });
  }

  let pkg;
  if (packageType !== undefined) {
    pkg = getPackage(String(packageType));
    if (!pkg) {
      return NextResponse.json({ error: "Geçersiz paket seçimi." }, { status: 400 });
    }
  }

  const setParts: string[] = ["updatedAt = CURRENT_TIMESTAMP"];
  const args: any[] = [];

  if (status) { setParts.push("status = ?"); args.push(status); }
  if (note !== undefined) { setParts.push("note = ?"); args.push(note); }
  if (cargoCompany !== undefined) { setParts.push("cargoCompany = ?"); args.push(cargoCompany || null); }
  if (trackingCode !== undefined) { setParts.push("trackingCode = ?"); args.push(trackingCode?.trim() || null); }
  if (typeof fullName === "string" && fullName.trim()) { setParts.push("fullName = ?"); args.push(fullName.trim()); }
  if (typeof phone === "string" && phone.trim()) { setParts.push("phone = ?"); args.push(phone.trim()); }
  if (typeof address === "string" && address.trim()) { setParts.push("address = ?"); args.push(address.trim()); }
  if (typeof city === "string" && city.trim()) { setParts.push("city = ?"); args.push(city.trim()); }
  if (typeof district === "string" && district.trim()) { setParts.push("district = ?"); args.push(district.trim()); }
  if (paymentType) { setParts.push("paymentType = ?"); args.push(paymentType); }
  if (pkg) {
    setParts.push("packageType = ?", "packageLabel = ?", "price = ?");
    args.push(pkg.key, pkg.packageLabel, pkg.price);
  }

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
