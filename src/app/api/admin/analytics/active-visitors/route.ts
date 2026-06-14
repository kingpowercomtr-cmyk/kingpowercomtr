import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getActiveVisitorCount, getTodayVisitorCount } from "@/lib/active-visitors";

export const dynamic = "force-dynamic";

export async function GET() {
  // Aynı filtreyi buraya da koyuyoruz ki derleme yaparken Vercel takılmasın
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({ activeVisitors: 0, todayVisitors: 0 });
  }

  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const [activeVisitors, todayVisitors] = await Promise.all([
      getActiveVisitorCount(),
      getTodayVisitorCount(),
    ]);
    return NextResponse.json({ activeVisitors, todayVisitors });
  } catch (error) {
    return NextResponse.json({ activeVisitors: 0, todayVisitors: 0 });
  }
}
