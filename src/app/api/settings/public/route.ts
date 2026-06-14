import { NextResponse } from "next/server";
import {
  getSiteSettings,
  SETTING_ANNOUNCEMENT_TEXT,
  SETTING_ANNOUNCEMENT_ENABLED,
  SETTING_PACKAGE_BADGE_TEXT,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

/** Herkese açık, landing sayfası için public ayarlar (auth gerekmez) */
export async function GET() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json({
      announcementText: "",
      announcementEnabled: false,
      packageBadgeText: "🔥 En Çok Tercih Edilen + Sprey Hediye 🎁",
    });
  }

  try {
    const settings = await getSiteSettings([
      SETTING_ANNOUNCEMENT_TEXT,
      SETTING_ANNOUNCEMENT_ENABLED,
      SETTING_PACKAGE_BADGE_TEXT,
    ]);

    return NextResponse.json(
      {
        announcementText: settings[SETTING_ANNOUNCEMENT_TEXT] || "🎁 2 ve üzeri kutu alımlarında geciktirici sprey HEDİYE!",
        announcementEnabled: settings[SETTING_ANNOUNCEMENT_ENABLED] === "true",
        packageBadgeText: settings[SETTING_PACKAGE_BADGE_TEXT] || "🔥 En Çok Tercih Edilen + Sprey Hediye 🎁",
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json({
      announcementText: "",
      announcementEnabled: false,
      packageBadgeText: "🔥 En Çok Tercih Edilen + Sprey Hediye 🎁",
    });
  }
}
