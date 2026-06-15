import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

const EVENT_LABELS: Record<string, (payload: any) => string> = {
  pageview: () => "🌐 Sayfa görüntülendi",
  heartbeat: () => "💓 Site üzerinde aktif",
  scroll_depth: (p) => `📜 Sayfanın %${p?.percent ?? "?"}'i görüntülendi`,
  section_view: (p) => `👁️ "${sectionLabel(p?.section)}" bölümü görüntülendi`,
  click: (p) => clickLabel(p),
  form_start: () => "📝 Form doldurmaya başlandı",
  form_submit: (p) => `✅ Sipariş tamamlandı (Paket: ${packageLabel(p?.packageType)})`,
  form_error: (p) => `⚠️ Form hatası: ${fieldLabel(p?.field)} - ${p?.message ?? ""}`,
  time_on_page: (p) => `⏱️ Sayfada ${p?.seconds ?? "?"} saniye geçirildi`,
};

function sectionLabel(section?: string): string {
  const map: Record<string, string> = {
    avantajlar: "Neden KingPower",
    kullanim: "Nasıl Kullanılır",
    icerikler: "İçerikler",
    siparis: "Sipariş Formu",
  };
  return map[section || ""] || section || "Bilinmeyen";
}

function packageLabel(pkg?: string): string {
  const map: Record<string, string> = { "1": "1 Kutu", "2": "2 Kutu", "3": "3 Kutu" };
  return map[pkg || ""] || pkg || "?";
}

function fieldLabel(field?: string): string {
  const map: Record<string, string> = {
    fullName: "Ad Soyad", phone: "Telefon", city: "Şehir", district: "İlçe", address: "Adres", form: "Form",
  };
  return map[field || ""] || field || "Alan";
}

function clickLabel(p: any): string {
  if (p?.label === "form_package_select") return `📦 ${packageLabel(p?.pkg)} paketine tıklandı`;
  if (p?.label === "payment_select") return `💳 Ödeme tipi seçildi: ${p?.type === "nakit" ? "Kapıda Nakit" : "Kapıda Kart"}`;
  if (p?.label) return `🖱️ Tıklandı: ${p.label}`;
  return "🖱️ Tıklama";
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  const ip = req.nextUrl.searchParams.get("ip");

  if (!sessionId && !ip) {
    return NextResponse.json({ error: "sessionId veya ip parametresi gereklidir." }, { status: 400 });
  }

  let events;
  try {
    if (sessionId) {
      events = await db.execute({
        sql: `SELECT * FROM Event WHERE sessionId = ? ORDER BY createdAt ASC LIMIT 200`,
        args: [sessionId],
      });
    } else {
      events = await db.execute({
        sql: `SELECT * FROM Event WHERE ip = ? ORDER BY createdAt ASC LIMIT 200`,
        args: [ip],
      });
    }
  } catch {
    // ip kolonu yoksa boş döndür
    events = { rows: [] };
  }

  const formatted = (events.rows as any[]).map((e) => {
    let payload: any = {};
    try { payload = JSON.parse(e.payload || "{}"); } catch {}
    const labelFn = EVENT_LABELS[e.eventType];
    return {
      id: e.id,
      sessionId: e.sessionId,
      eventType: e.eventType,
      page: e.page,
      createdAt: e.createdAt,
      label: labelFn ? labelFn(payload) : `${e.eventType}`,
    };
  });

  return NextResponse.json({ events: formatted });
}
