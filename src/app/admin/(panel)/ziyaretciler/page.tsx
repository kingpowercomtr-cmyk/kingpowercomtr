"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Visit {
  id: number;
  sessionId: string;
  ip: string;
  browser: string;
  os: string;
  device: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  createdAt: string;
}

interface SessionEvent {
  id: number;
  sessionId: string;
  eventType: string;
  page: string;
  createdAt: string;
  label: string;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr.replace(" ", "T") + (dateStr.includes("Z") ? "" : "Z"));
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr.replace(" ", "T") + (dateStr.includes("Z") ? "" : "Z")).toLocaleString("tr-TR");
}

const DEVICE_ICONS: Record<string, string> = {
  mobile: "📱",
  tablet: "📱",
  desktop: "💻",
};

export default function AdminZiyaretciler() {
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [total, setTotal] = useState(0);
  const [uniqueIps, setUniqueIps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deviceFilter, setDeviceFilter] = useState<string>("");

  // Session log modal
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [sessionEvents, setSessionEvents] = useState<SessionEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/visits")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/giris");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setVisits(d.visits || []);
          setTotal(d.total || 0);
          setUniqueIps(d.uniqueIps || 0);
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const openSessionLog = (visit: Visit) => {
    setSelectedVisit(visit);
    setEventsLoading(true);
    setSessionEvents([]);
    fetch(`/api/admin/visits/session?sessionId=${encodeURIComponent(visit.sessionId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.events) setSessionEvents(d.events);
      })
      .finally(() => setEventsLoading(false));
  };

  if (loading) {
    return <div className="text-gray-500 text-center py-20">Yükleniyor...</div>;
  }

  // Özet istatistikler
  const deviceCounts: Record<string, number> = {};
  const browserCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};

  visits.forEach((v) => {
    const dev = (v.device || "Desktop").toLowerCase();
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    const br = v.browser || "Bilinmeyen";
    browserCounts[br] = (browserCounts[br] || 0) + 1;
    const src = v.utmSource || (v.referrer ? safeHostname(v.referrer) : "Doğrudan");
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const topBrowsers = Object.entries(browserCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const topSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const filteredVisits = deviceFilter
    ? visits.filter((v) => (v.device || "Desktop").toLowerCase() === deviceFilter)
    : visits;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Ziyaretçiler</h1>
        <p className="text-gray-500 text-sm mt-1">
          {uniqueIps} benzersiz IP · Toplam {total} kayıt — bir IP&apos;ye ait en güncel ziyaret gösteriliyor
        </p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Cihaz Dağılımı</p>
          <div className="space-y-2">
            {Object.entries(deviceCounts).sort((a, b) => b[1] - a[1]).map(([dev, count]) => (
              <button
                key={dev}
                onClick={() => setDeviceFilter(deviceFilter === dev ? "" : dev)}
                className={`w-full flex items-center justify-between text-sm px-2 py-1.5 rounded-lg transition-colors ${
                  deviceFilter === dev ? "bg-blue-500/15 text-blue-400" : "hover:bg-white/5 text-gray-300"
                }`}
              >
                <span className="capitalize">{DEVICE_ICONS[dev] || "❓"} {dev}</span>
                <span className="font-bold">{count}</span>
              </button>
            ))}
            {Object.keys(deviceCounts).length === 0 && <p className="text-gray-600 text-sm">Veri yok.</p>}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Tarayıcılar</p>
          <div className="space-y-2">
            {topBrowsers.map(([br, count]) => (
              <div key={br} className="flex items-center justify-between text-sm text-gray-300 px-2 py-1.5">
                <span>{br}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
            {topBrowsers.length === 0 && <p className="text-gray-600 text-sm">Veri yok.</p>}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Trafik Kaynağı</p>
          <div className="space-y-2">
            {topSources.map(([src, count]) => (
              <div key={src} className="flex items-center justify-between text-sm text-gray-300 px-2 py-1.5">
                <span className="truncate">{src}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
            {topSources.length === 0 && <p className="text-gray-600 text-sm">Veri yok.</p>}
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-bold text-white">Ziyaretçiler (Benzersiz IP)</h2>
          {deviceFilter && (
            <button
              onClick={() => setDeviceFilter("")}
              className="text-xs text-gray-400 hover:text-white"
            >
              Filtreyi kaldır ({DEVICE_ICONS[deviceFilter] || ""} {deviceFilter}) ✕
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-gray-500 border-b border-white/10 text-xs uppercase bg-black/30">
                <th className="text-left px-4 py-3">Cihaz</th>
                <th className="text-left px-4 py-3">IP Adresi</th>
                <th className="text-left px-4 py-3">Tarayıcı / OS</th>
                <th className="text-left px-4 py-3">Kaynak</th>
                <th className="text-left px-4 py-3">Son Görülme</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVisits.map((v) => {
                const source = v.utmSource || (v.referrer ? safeHostname(v.referrer) : "Doğrudan ziyaret");
                return (
                  <tr key={v.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-2xl">
                      {DEVICE_ICONS[(v.device || "desktop").toLowerCase()] || "💻"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-300">{v.ip || "—"}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-200">{v.browser || "Bilinmeyen"}</p>
                      <p className="text-xs text-gray-500">{v.os || "Bilinmeyen"}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {source} {v.utmCampaign ? `· ${v.utmCampaign}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-300 text-xs">{timeAgo(v.createdAt)}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{formatDateTime(v.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openSessionLog(v)}
                        className="px-3 py-1.5 text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded hover:bg-purple-500/25 transition-colors whitespace-nowrap"
                      >
                        📋 Oturum Geçmişi
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredVisits.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-600">
                    Henüz ziyaret yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Oturum log modal */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVisit(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-lg max-h-[80vh] overflow-y-auto bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="text-xl font-bold text-white">Oturum Geçmişi</h2>
                <p className="text-gray-500 text-sm font-mono">{selectedVisit.ip} · {selectedVisit.browser} / {selectedVisit.os}</p>
              </div>
              <button onClick={() => setSelectedVisit(null)} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
            </div>

            <div className="mt-5 space-y-3">
              {eventsLoading ? (
                <p className="text-gray-500 text-sm text-center py-8">Yükleniyor...</p>
              ) : sessionEvents.length > 0 ? (
                sessionEvents.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 border-l-2 border-white/10 pl-3 pb-1">
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">{ev.label}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{formatDateTime(ev.createdAt)} · {ev.page}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm text-center py-8">Bu oturum için kayıtlı aktivite bulunamadı.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function safeUrl(url: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    return "https://" + url;
  }
}

function safeHostname(url: string): string {
  try {
    return new URL(safeUrl(url)).hostname.replace("www.", "");
  } catch {
    return url;
  }
}
