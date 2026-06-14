import { db } from "@/lib/db";

export const ACTIVE_VISITOR_WINDOW_MS = 5 * 60 * 1000;

/** SQLite CURRENT_TIMESTAMP formatına uygun "YYYY-MM-DD HH:MM:SS" string üretir (UTC) */
function sqliteTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export async function getActiveVisitorCount(): Promise<number> {
  const since = sqliteTimestamp(new Date(Date.now() - ACTIVE_VISITOR_WINDOW_MS));
  const result = await db.execute({
    sql: `SELECT COUNT(DISTINCT sessionId) as count FROM Event WHERE createdAt >= ? AND sessionId NOT IN ('ssr', '')`,
    args: [since],
  });
  return Number((result.rows[0] as any)?.count ?? 0);
}

export async function getTodayVisitorCount(): Promise<number> {
  const now = new Date();
  const startOfToday = sqliteTimestamp(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  const result = await db.execute({
    sql: `SELECT COUNT(DISTINCT sessionId) as count FROM Visit WHERE createdAt >= ?`,
    args: [startOfToday],
  });
  return Number((result.rows[0] as any)?.count ?? 0);
}

export function activeFormFillersFromVisitors(activeVisitors: number): number {
  if (activeVisitors <= 0) return 0;
  if (activeVisitors === 1) return 1;
  const estimated = Math.round(activeVisitors * 0.35);
  return Math.max(2, Math.min(estimated, activeVisitors - 1));
}
