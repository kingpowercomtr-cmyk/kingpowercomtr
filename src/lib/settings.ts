import { db } from "@/lib/db";

export const SETTING_PIXEL_CODE = "pixel_code";

export async function getSiteSetting(key: string): Promise<string> {
  try {
    const result = await db.execute({ sql: "SELECT value FROM SiteSetting WHERE key = ?", args: [key] });
    return (result.rows[0] as any)?.value ?? "";
  } catch {
    return "";
  }
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  await db.execute({
    sql: `INSERT INTO SiteSetting (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = CURRENT_TIMESTAMP`,
    args: [key, value],
  });
}
