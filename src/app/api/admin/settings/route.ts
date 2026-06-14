import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getSiteSettings,
  setSiteSettings,
  SETTING_PIXEL_CODE,
  SETTING_PROFIT_PER_ORDER,
  SETTING_CARGO_COMPANIES,
  SETTING_ANNOUNCEMENT_TEXT,
  SETTING_ANNOUNCEMENT_ENABLED,
  SETTING_PACKAGE_BADGE_TEXT,
  SETTING_CONTACT_PHONE,
  SETTING_CONTACT_WHATSAPP,
  SETTING_ADMIN_NOTE,
  SETTING_SOUND_NOTIFICATIONS,
} from "@/lib/settings";
import { PROFIT_PER_ORDER } from "@/lib/constants";
import { CARGO_COMPANIES } from "@/lib/order-status";

const ALL_KEYS = [
  SETTING_PIXEL_CODE,
  SETTING_PROFIT_PER_ORDER,
  SETTING_CARGO_COMPANIES,
  SETTING_ANNOUNCEMENT_TEXT,
  SETTING_ANNOUNCEMENT_ENABLED,
  SETTING_PACKAGE_BADGE_TEXT,
  SETTING_CONTACT_PHONE,
  SETTING_CONTACT_WHATSAPP,
  SETTING_ADMIN_NOTE,
  SETTING_SOUND_NOTIFICATIONS,
];

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const settings = await getSiteSettings(ALL_KEYS);

  return NextResponse.json({
    pixelCode: settings[SETTING_PIXEL_CODE] || "",
    profitPerOrder: settings[SETTING_PROFIT_PER_ORDER] ? Number(settings[SETTING_PROFIT_PER_ORDER]) : PROFIT_PER_ORDER,
    cargoCompanies: settings[SETTING_CARGO_COMPANIES]
      ? JSON.parse(settings[SETTING_CARGO_COMPANIES])
      : CARGO_COMPANIES.filter((c) => c),
    announcementText: settings[SETTING_ANNOUNCEMENT_TEXT] || "🎁 2 ve üzeri kutu alımlarında geciktirici sprey HEDİYE!",
    announcementEnabled: settings[SETTING_ANNOUNCEMENT_ENABLED] === "true",
    packageBadgeText: settings[SETTING_PACKAGE_BADGE_TEXT] || "🔥 En Çok Tercih Edilen + Sprey Hediye 🎁",
    contactPhone: settings[SETTING_CONTACT_PHONE] || "",
    contactWhatsapp: settings[SETTING_CONTACT_WHATSAPP] || "",
    adminNote: settings[SETTING_ADMIN_NOTE] || "",
    soundNotifications: settings[SETTING_SOUND_NOTIFICATIONS] !== "false",
  });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const body = await req.json();
  const updates: Record<string, string> = {};

  if (typeof body.pixelCode === "string") updates[SETTING_PIXEL_CODE] = body.pixelCode;
  if (body.profitPerOrder !== undefined && !Number.isNaN(Number(body.profitPerOrder))) {
    updates[SETTING_PROFIT_PER_ORDER] = String(Number(body.profitPerOrder));
  }
  if (Array.isArray(body.cargoCompanies)) {
    updates[SETTING_CARGO_COMPANIES] = JSON.stringify(body.cargoCompanies.filter((c: unknown) => typeof c === "string" && c.trim()));
  }
  if (typeof body.announcementText === "string") updates[SETTING_ANNOUNCEMENT_TEXT] = body.announcementText;
  if (typeof body.announcementEnabled === "boolean") updates[SETTING_ANNOUNCEMENT_ENABLED] = body.announcementEnabled ? "true" : "false";
  if (typeof body.packageBadgeText === "string") updates[SETTING_PACKAGE_BADGE_TEXT] = body.packageBadgeText;
  if (typeof body.contactPhone === "string") updates[SETTING_CONTACT_PHONE] = body.contactPhone;
  if (typeof body.contactWhatsapp === "string") updates[SETTING_CONTACT_WHATSAPP] = body.contactWhatsapp;
  if (typeof body.adminNote === "string") updates[SETTING_ADMIN_NOTE] = body.adminNote;
  if (typeof body.soundNotifications === "boolean") updates[SETTING_SOUND_NOTIFICATIONS] = body.soundNotifications ? "true" : "false";

  // Şifre değişikliği
  if (typeof body.newPassword === "string" && body.newPassword.trim()) {
    if (body.newPassword.length < 4) {
      return NextResponse.json({ error: "Şifre en az 4 karakter olmalıdır." }, { status: 400 });
    }
    await db.execute({
      sql: `UPDATE AdminUser SET password = ? WHERE username = 'admin'`,
      args: [body.newPassword],
    });
  }

  if (Object.keys(updates).length > 0) {
    await setSiteSettings(updates);
  }

  return NextResponse.json({ success: true });
}
