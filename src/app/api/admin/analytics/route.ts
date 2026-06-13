import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { PENDING_CARGO_STATUSES } from "@/lib/order-status";
import { PROFIT_PER_ORDER } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const pendingStatuses = PENDING_CARGO_STATUSES.map(() => "?").join(",");

    const [total, revenue, today, pending, monthRevenue, monthCount, visits, byStatus, byPackage] = await Promise.all([
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order"`, args: [] }),
      db.execute({ sql: `SELECT SUM(price) as s FROM "Order" WHERE status != 'iade'`, args: [] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE createdAt >= ? AND status != 'iade'`, args: [startOfToday] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE status IN (${pendingStatuses})`, args: PENDING_CARGO_STATUSES }),
      db.execute({ sql: `SELECT SUM(price) as s FROM "Order" WHERE createdAt >= ? AND status != 'iade'`, args: [startOfMonth] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE createdAt >= ? AND status != 'iade'`, args: [startOfMonth] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM Visit`, args: [] }),
      db.execute({ sql: `SELECT status, COUNT(*) as count FROM "Order" GROUP BY status`, args: [] }),
      db.execute({ sql: `SELECT packageType, COUNT(*) as count, SUM(price) as total FROM "Order" GROUP BY packageType`, args: [] }),
    ]);

    const totalOrders = Number((total.rows[0] as any)?.c ?? 0);
    const totalRevenue = Number((revenue.rows[0] as any)?.s ?? 0);
    const todayOrders = Number((today.rows[0] as any)?.c ?? 0);
    const pendingCargo = Number((pending.rows[0] as any)?.c ?? 0);
    const monthlyRevenue = Number((monthRevenue.rows[0] as any)?.s ?? 0);
    const monthlyOrderCount = Number((monthCount.rows[0] as any)?.c ?? 0);
    const totalVisits = Number((visits.rows[0] as any)?.c ?? 0);

    return NextResponse.json({
      totalOrders, totalRevenue, todayOrders, pendingCargo,
      monthlyRevenue, monthlyOrderCount,
      totalProfitOrders: totalOrders * PROFIT_PER_ORDER,
      todayProfitOrders: todayOrders * PROFIT_PER_ORDER,
      monthlyProfitOrders: monthlyOrderCount * PROFIT_PER_ORDER,
      ordersByStatus: byStatus.rows,
      ordersByPackage: byPackage.rows,
      totalVisits, eventCounts: [], recentOrders: []
    });
  } catch (error) {
    return NextResponse.json({ error: "Veriler alınamadı." }, { status: 500 });
  }
}
