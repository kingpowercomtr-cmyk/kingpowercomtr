import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, eventType, page, payload } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // If this is a pageview, also create/update Visit
    if (eventType === "pageview") {
      const ua = req.headers.get("user-agent") || "";
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

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

      await prisma.visit.create({
        data: {
          sessionId,
          ip,
          userAgent: ua,
          browser,
          os,
          device,
          referrer: parsed.referrer || null,
          utmSource: parsed.utm_source || null,
          utmMedium: parsed.utm_medium || null,
          utmCampaign: parsed.utm_campaign || null,
        },
      });
    }

    await prisma.event.create({
      data: { sessionId, eventType, page: page || "/", payload: payload || null },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/track error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
