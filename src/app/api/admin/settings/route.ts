import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getSiteSetting, setSiteSetting, SETTING_PIXEL_CODE } from "@/lib/settings";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const pixelCode = await getSiteSetting(SETTING_PIXEL_CODE);
  return NextResponse.json({ pixelCode });
}

export async function PUT(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }
  const { pixelCode } = await req.json();
  await setSiteSetting(SETTING_PIXEL_CODE, typeof pixelCode === "string" ? pixelCode : "");
  return NextResponse.json({ success: true });
}
