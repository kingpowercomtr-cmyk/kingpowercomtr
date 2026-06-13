import { prisma } from "@/lib/db";

/** Oturum bu süre içinde sinyal gönderdiyse "aktif" sayılır */
export const ACTIVE_VISITOR_WINDOW_MS = 5 * 60 * 1000;

const IGNORED_SESSIONS = ["ssr", ""];

export async function getActiveVisitorCount(): Promise<number> {
  const since = new Date(Date.now() - ACTIVE_VISITOR_WINDOW_MS);

  const rows = await prisma.event.findMany({
    where: {
      createdAt: { gte: since },
      sessionId: { notIn: IGNORED_SESSIONS },
    },
    distinct: ["sessionId"],
    select: { sessionId: true },
  });

  return rows.length;
}

/** Form FOMO metni için: aktif ziyaretçinin makul bir alt kümesi */
export function activeFormFillersFromVisitors(activeVisitors: number): number {
  if (activeVisitors <= 0) return 0;
  if (activeVisitors === 1) return 1;
  // Çoğu ziyaretçi gezinir, azı formda — gerçekçi oran
  const estimated = Math.round(activeVisitors * 0.35);
  return Math.max(2, Math.min(estimated, activeVisitors - 1));
}
