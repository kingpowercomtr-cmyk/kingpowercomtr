import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { PENDING_CARGO_STATUSES, STATUS_LABELS } from "@/lib/order-status";
import { getSiteSetting, SETTING_PROFIT_PER_ORDER } from "@/lib/settings";
import { PROFIT_PER_ORDER } from "@/lib/constants";
import { getTodayVisitorCount } from "@/lib/active-visitors";

export const dynamic = "force-dynamic";

/** SQLite CURRENT_TIMESTAMP formatına uygun "YYYY-MM-DD HH:MM:SS" string üretir (UTC) */
function sqliteTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfToday = sqliteTimestamp(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    const startOfYesterday = sqliteTimestamp(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    const startOfMonth = sqliteTimestamp(new Date(now.getFullYear(), now.getMonth(), 1));
    const startOfLastMonth = sqliteTimestamp(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const startOfWeek = sqliteTimestamp(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
    const startOfPrevWeek = sqliteTimestamp(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000));

    const pendingStatuses = PENDING_CARGO_STATUSES.map(() => "?").join(",");

    const profitSetting = await getSiteSetting(SETTING_PROFIT_PER_ORDER);
    const profitPerOrder = profitSetting ? Number(profitSetting) || PROFIT_PER_ORDER : PROFIT_PER_ORDER;

    const [
      total, revenue, today, yesterday, pending, monthRevenue, monthCount,
      lastMonthRevenue, lastMonthCount, visits, byStatus, byPackage,
      byPayment, byCity, weekCount, prevWeekCount, iadeCount, recentOrders,
      todayVisitors,
    ] = await Promise.all([
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order"`, args: [] }),
      db.execute({ sql: `SELECT SUM(price) as s FROM "Order" WHERE status != 'iade'`, args: [] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE createdAt >= ? AND status != 'iade'`, args: [startOfToday] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE createdAt >= ? AND createdAt < ? AND status != 'iade'`, args: [startOfYesterday, startOfToday] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE status IN (${pendingStatuses})`, args: PENDING_CARGO_STATUSES }),
      db.execute({ sql: `SELECT SUM(price) as s FROM "Order" WHERE createdAt >= ? AND status != 'iade'`, args: [startOfMonth] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE createdAt >= ? AND status != 'iade'`, args: [startOfMonth] }),
      db.execute({ sql: `SELECT SUM(price) as s FROM "Order" WHERE createdAt >= ? AND createdAt < ? AND status != 'iade'`, args: [startOfLastMonth, startOfMonth] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE createdAt >= ? AND createdAt < ? AND status != 'iade'`, args: [startOfLastMonth, startOfMonth] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM Visit`, args: [] }),
      db.execute({ sql: `SELECT status, COUNT(*) as count FROM "Order" GROUP BY status`, args: [] }),
      db.execute({ sql: `SELECT packageType, packageLabel, COUNT(*) as count, SUM(price) as total FROM "Order" GROUP BY packageType ORDER BY count DESC`, args: [] }),
      db.execute({ sql: `SELECT paymentType, COUNT(*) as count FROM "Order" GROUP BY paymentType`, args: [] }),
      db.execute({ sql: `SELECT city, COUNT(*) as count FROM "Order" GROUP BY city ORDER BY count DESC LIMIT 8`, args: [] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE createdAt >= ? AND status != 'iade'`, args: [startOfWeek] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE createdAt >= ? AND createdAt < ? AND status != 'iade'`, args: [startOfPrevWeek, startOfWeek] }),
      db.execute({ sql: `SELECT COUNT(*) as c FROM "Order" WHERE status = 'iade'`, args: [] }),
      db.execute({ sql: `SELECT code, fullName, packageLabel, price, status, createdAt FROM "Order" ORDER BY createdAt DESC LIMIT 8`, args: [] }),
      getTodayVisitorCount(),
    ]);

    const totalOrders = Number((total.rows[0] as any)?.c ?? 0);
    const totalRevenue = Number((revenue.rows[0] as any)?.s ?? 0);
    const todayOrders = Number((today.rows[0] as any)?.c ?? 0);
    const yesterdayOrders = Number((yesterday.rows[0] as any)?.c ?? 0);
    const pendingCargo = Number((pending.rows[0] as any)?.c ?? 0);
    const monthlyRevenue = Number((monthRevenue.rows[0] as any)?.s ?? 0);
    const monthlyOrderCount = Number((monthCount.rows[0] as any)?.c ?? 0);
    const lastMonthRevenueVal = Number((lastMonthRevenue.rows[0] as any)?.s ?? 0);
    const lastMonthOrderCount = Number((lastMonthCount.rows[0] as any)?.c ?? 0);
    const totalVisits = Number((visits.rows[0] as any)?.c ?? 0);
    const weekOrders = Number((weekCount.rows[0] as any)?.c ?? 0);
    const prevWeekOrders = Number((prevWeekCount.rows[0] as any)?.c ?? 0);
    const iadeOrders = Number((iadeCount.rows[0] as any)?.c ?? 0);

    function pctChange(curr: number, prev: number): number | null {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    }

    const topPackage = (byPackage.rows[0] as any) || null;

    return NextResponse.json({
      totalOrders, totalRevenue, todayOrders, pendingCargo,
      monthlyRevenue, monthlyOrderCount,
      profitPerOrder,
      totalProfitOrders: totalOrders * profitPerOrder,
      todayProfitOrders: todayOrders * profitPerOrder,
      monthlyProfitOrders: monthlyOrderCount * profitPerOrder,
      ordersByStatus: (byStatus.rows as any[]).map((r) => ({ ...r, label: STATUS_LABELS[r.status] || r.status })),
      ordersByPackage: byPackage.rows,
      ordersByPayment: byPayment.rows,
      ordersByCity: byCity.rows,
      totalVisits,
      todayVisitors,
      eventCounts: [],
      recentOrders: recentOrders.rows,
      // Karşılaştırmalar
      weekOrders,
      prevWeekOrders,
      weekChangePercent: pctChange(weekOrders, prevWeekOrders),
      monthlyRevenueChangePercent: pctChange(monthlyRevenue, lastMonthRevenueVal),
      monthlyOrderChangePercent: pctChange(monthlyOrderCount, lastMonthOrderCount),
      dailyOrderChangePercent: pctChange(todayOrders, yesterdayOrders),
      // En çok satan paket
      topPackage: topPackage ? { label: topPackage.packageLabel, count: Number(topPackage.count) } : null,
      // İade oranı
      iadeOrders,
      iadeRate: totalOrders > 0 ? Math.round((iadeOrders / totalOrders) * 1000) / 10 : 0,
    });
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);
    return NextResponse.json({ error: "Veriler alınamadı." }, { status: 500 });
  }
}
