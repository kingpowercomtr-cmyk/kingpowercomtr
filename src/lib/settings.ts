import { prisma } from "@/lib/db";

export const SETTING_PIXEL_CODE = "pixel_code";

export async function getSiteSetting(key: string): Promise<string> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? "";
  } catch {
    return "";
  }
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
