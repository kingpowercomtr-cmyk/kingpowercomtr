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

const DEVICE_ICONS: Record<string, string> = {
  mobile: "📱",
  tablet: "📱",
  desktop: "💻",
};

export default function AdminZiyaretciler() {
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deviceFilter, setDeviceFilter] = useState<string>("");

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
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

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
    const src = v.utmSource || (v.referrer ? new URL(safeUrl(v.referrer)).hostname.replace("www.", "") : "Doğrudan");
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
        <p className="text-gray-500 text-sm mt-1">Son {visits.length} ziyaret · Toplam {total} kayıt</p>
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
          <h2 className="text-sm font-bold text-white">Son Ziyaretler</h2>
          {deviceFilter && (
            <button
              onClick={() => setDeviceFilter("")}
              className="text-xs text-gray-400 hover:text-white"
            >
              Filtreyi kaldır ({DEVICE_ICONS[deviceFilter] || ""} {deviceFilter}) ✕
            </button>
          )}
        </div>
        <div className="divide-y divide-white/5">
          {filteredVisits.map((v) => {
            const source = v.utmSource || (v.referrer ? safeHostname(v.referrer) : "Doğrudan ziyaret");
            return (
              <div key={v.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/3 transition-colors">
                <div className="text-2xl w-8 text-center flex-shrink-0">
                  {DEVICE_ICONS[(v.device || "desktop").toLowerCase()] || "💻"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-gray-200">
                    <span className="font-medium">{v.browser || "Bilinmeyen"}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-400">{v.os || "Bilinmeyen"}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {source} {v.utmCampaign ? `· ${v.utmCampaign}` : ""}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{timeAgo(v.createdAt)}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{new Date(v.createdAt.replace(" ", "T") + (v.createdAt.includes("Z") ? "" : "Z")).toLocaleString("tr-TR")}</p>
                </div>
              </div>
            );
          })}
          {filteredVisits.length === 0 && (
            <div className="text-center py-10 text-gray-600">Henüz ziyaret yok.</div>
          )}
        </div>
      </div>
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
