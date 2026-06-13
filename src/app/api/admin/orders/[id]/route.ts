import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { ORDER_STATUS_VALUES, CARGO_COMPANIES } from "@/lib/order-status";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  if (cargoCompany) {
    const allowed = CARGO_COMPANIES.filter(Boolean) as string[];
    if (!allowed.includes(cargoCompany)) {
      return NextResponse.json({ error: "Geçersiz kargo firması." }, { status: 400 });
    }
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      ...(status ? { status } : {}),
      ...(note !== undefined ? { note } : {}),
      ...(cargoCompany !== undefined ? { cargoCompany: cargoCompany || null } : {}),
      ...(trackingCode !== undefined ? { trackingCode: trackingCode?.trim() || null } : {}),
    },
  });

  return NextResponse.json({ success: true, order });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const { id } = await params;
  const orderId = parseInt(id, 10);
  if (Number.isNaN(orderId)) {
    return NextResponse.json({ error: "Geçersiz sipariş." }, { status: 400 });
  }

  try {
    await prisma.order.delete({ where: { id: orderId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sipariş silinemedi." }, { status: 404 });
  }
}
