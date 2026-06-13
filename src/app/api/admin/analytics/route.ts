import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { PENDING_CARGO_STATUSES } from "@/lib/order-status";
import { PROFIT_PER_ORDER } from "@/lib/constants";

export const dynamic = "force-dynamic";

const notRefunded = { status: { not: "iade" as const } };

export async function GET() {
  // Vercel derleme (build) yaparken veritabanı olmadığı için buraya çarpıp çökmesin diye esnaf filtresi
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({
      totalOrders: 0, totalRevenue: 0, todayOrders: 0, pendingCargo: 0,
      monthlyRevenue: 0, monthlyOrderCount: 0, totalProfitOrders: 0,
      todayProfitOrders: 0, monthlyProfitOrders: 0, ordersByStatus: [],
      ordersByPackage: [], totalVisits: 0, eventCounts: [], recentOrders: []
    });
  }

  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrders,
      totalRevenueResult,
      todayOrders,
      pendingCargo,
      monthlyRevenueResult,
      monthlyOrderCount,
      totalProfitOrders,
      todayProfitOrders,
      monthlyProfitOrders,
      ordersByStatus,
      ordersByPackage,
      totalVisits,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ where: notRefunded, _sum: { price: true } }),
      prisma.order.count({ where: { createdAt: { gte: startOfToday }, ...notRefunded } }),
      prisma.order.count({ where: { status: { in: PENDING_CARGO_STATUSES } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth }, ...notRefunded },
        _sum: { price: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth }, ...notRefunded } }),
      prisma.order.count({ where: notRefunded }),
      prisma.order.count({ where: { createdAt: { gte: startOfToday }, ...notRefunded } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth }, ...notRefunded } }),
      prisma.order.groupBy({  by: ["status"], _count: true }),
      prisma.order.groupBy({ by: ["packageType"], _count: true, _sum: { price: true } }),
      prisma.visit.count(),
    ]);

    const totalRevenue = totalRevenueResult._sum.price || 0;
    const monthlyRevenue = monthlyRevenueResult._sum.price || 0;

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      todayOrders,
      pendingCargo,
      monthlyRevenue,
      monthlyOrderCount,
      totalProfitOrders: totalProfitOrders * PROFIT_PER_ORDER,
      todayProfitOrders: todayProfitOrders * PROFIT_PER_ORDER,
      monthlyProfitOrders: monthlyProfitOrders * PROFIT_PER_ORDER,
      ordersByStatus,
      ordersByPackage,
      totalVisits,
      eventCounts: [],
      recentOrders: []
    });
  } catch (error) {
    return NextResponse.json({ error: "Veriler alınamadı." }, { status: 500 });
  }
}