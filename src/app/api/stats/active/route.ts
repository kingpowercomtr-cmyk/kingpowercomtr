import { NextResponse } from "next/server";
import {
  activeFormFillersFromVisitors,
  getActiveVisitorCount,
} from "@/lib/active-visitors";

export const dynamic = "force-dynamic";

/** Landing FOMO - auth gerektirmez, sadece özet sayılar */
export async function GET() {
  // ESNAF JİLETİ: Eğer Vercel şu an derleme (build) aşamasındaysa, veritabanına dokunmadan sahte veri dön geç!
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return NextResponse.json(
      { activeVisitors: 0, formFillers: 0 },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  try {
    const activeVisitors = await getActiveVisitorCount();
    const formFillers = activeFormFillersFromVisitors(activeVisitors);

    return NextResponse.json(
      { activeVisitors, formFillers },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { activeVisitors: 0, formFillers: 0 },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}