import { db } from "@/lib/db";

export const SETTING_PIXEL_CODE = "pixel_code";
export const SETTING_PROFIT_PER_ORDER = "profit_per_order";
export const SETTING_CARGO_COMPANIES = "cargo_companies";
export const SETTING_ANNOUNCEMENT_TEXT = "announcement_text";
export const SETTING_ANNOUNCEMENT_ENABLED = "announcement_enabled";
export const SETTING_PACKAGE_BADGE_TEXT = "package_badge_text";
export const SETTING_CONTACT_PHONE = "contact_phone";
export const SETTING_CONTACT_WHATSAPP = "contact_whatsapp";
export const SETTING_ADMIN_NOTE = "admin_note";
export const SETTING_SOUND_NOTIFICATIONS = "sound_notifications";

export async function getSiteSetting(key: string): Promise<string> {
  try {
    const result = await db.execute({ sql: "SELECT value FROM SiteSetting WHERE key = ?", args: [key] });
    return (result.rows[0] as any)?.value ?? "";
  } catch {
    return "";
  }
}

export async function getSiteSettings(keys: string[]): Promise<Record<string, string>> {
  try {
    const placeholders = keys.map(() => "?").join(",");
    const result = await db.execute({ sql: `SELECT key, value FROM SiteSetting WHERE key IN (${placeholders})`, args: keys });
    const map: Record<string, string> = {};
    for (const row of result.rows as any[]) {
      map[row.key] = row.value;
    }
    return map;
  } catch {
    return {};
  }
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  await db.execute({
    sql: `INSERT INTO SiteSetting (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = CURRENT_TIMESTAMP`,
    args: [key, value],
  });
}

export async function setSiteSettings(values: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(values)) {
    await setSiteSetting(key, value);
  }
}
