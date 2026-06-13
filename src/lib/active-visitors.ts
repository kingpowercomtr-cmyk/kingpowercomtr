import { db } from "@/lib/db";

export const ACTIVE_VISITOR_WINDOW_MS = 5 * 60 * 1000;

export async function getActiveVisitorCount(): Promise<number> {
  const since = new Date(Date.now() - ACTIVE_VISITOR_WINDOW_MS).toISOString();
  const result = await db.execute({
    sql: `SELECT COUNT(DISTINCT sessionId) as count FROM Event WHERE createdAt >= ? AND sessionId NOT IN ('ssr', '')`,
    args: [since],
  });
  return Number((result.rows[0] as any)?.count ?? 0);
}

export function activeFormFillersFromVisitors(activeVisitors: number): number {
  if (activeVisitors <= 0) return 0;
  if (activeVisitors === 1) return 1;
  const estimated = Math.round(activeVisitors * 0.35);
  return Math.max(2, Math.min(estimated, activeVisitors - 1));
}
