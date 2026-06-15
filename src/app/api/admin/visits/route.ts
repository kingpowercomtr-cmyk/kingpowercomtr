import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = 50;
  const offset = (page - 1) * limit;

  // Her IP için en son ziyaretini al (tekilleştirme) - aynı IP yenileme yapınca tekrar listede çıkmasın
  const [visitsResult, countResult, uniqueIpResult] = await Promise.all([
    db.execute({
      sql: `SELECT v.* FROM Visit v
            INNER JOIN (
              SELECT ip, MAX(createdAt) as maxCreated
              FROM Visit
              GROUP BY ip
            ) latest ON v.ip = latest.ip AND v.createdAt = latest.maxCreated
            ORDER BY v.createdAt DESC
            LIMIT ? OFFSET ?`,
      args: [limit, offset],
    }),
    db.execute({ sql: `SELECT COUNT(DISTINCT ip) as count FROM Visit`, args: [] }),
    db.execute({ sql: `SELECT COUNT(DISTINCT ip) as count FROM Visit`, args: [] }),
  ]);

  return NextResponse.json({
    visits: visitsResult.rows,
    total: Number((countResult.rows[0] as any)?.count ?? 0),
    uniqueIps: Number((uniqueIpResult.rows[0] as any)?.count ?? 0),
  });
}
