import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, eventType, page, payload } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

    if (eventType === "pageview") {
      const ua = req.headers.get("user-agent") || "";

      let browser = "Unknown", os = "Unknown", device = "Desktop";
      try {
        const { UAParser } = await import("ua-parser-js");
        const parser = new UAParser(ua);
        const result = parser.getResult();
        browser = result.browser.name || "Unknown";
        os = result.os.name || "Unknown";
        device = result.device.type || "Desktop";
      } catch {}

      let parsed: Record<string, string> = {};
      try { parsed = JSON.parse(payload || "{}"); } catch {}

      await db.execute({
        sql: `INSERT INTO Visit (sessionId, ip, userAgent, browser, os, device, referrer, utmSource, utmMedium, utmCampaign, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        args: [sessionId, ip, ua, browser, os, device, parsed.referrer || null, parsed.utm_source || null, parsed.utm_medium || null, parsed.utm_campaign || null],
      });
    }

    try {
      await db.execute({
        sql: `INSERT INTO Event (sessionId, eventType, page, payload, ip, createdAt) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        args: [sessionId, eventType, page || "/", payload || null, ip],
      });
    } catch {
      // ip kolonu henüz migrate edilmemiş olabilir - eski şema ile dene
      await db.execute({
        sql: `INSERT INTO Event (sessionId, eventType, page, payload, createdAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        args: [sessionId, eventType, page || "/", payload || null],
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/track error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
