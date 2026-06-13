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

export default function AdminZiyaretciler() {
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

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
        if (d) setVisits(d.visits || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ziyaretçiler</h1>
      {loading ? (
        <div className="text-gray-500 text-center py-20">Yükleniyor...</div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b border-white/10 text-xs uppercase">
                  <th className="text-left px-4 py-3">Session</th>
                  <th className="text-left px-4 py-3">IP</th>
                  <th className="text-left px-4 py-3">Tarayıcı</th>
                  <th className="text-left px-4 py-3">OS</th>
                  <th className="text-left px-4 py-3">Cihaz</th>
                  <th className="text-left px-4 py-3">Kaynak</th>
                  <th className="text-left px-4 py-3">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-white/3">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {v.sessionId?.slice(0, 16)}...
                    </td>
                    <td className="px-4 py-3 text-gray-300">{v.ip}</td>
                    <td className="px-4 py-3 text-gray-400">{v.browser}</td>
                    <td className="px-4 py-3 text-gray-400">{v.os}</td>
                    <td className="px-4 py-3 text-gray-400">{v.device}</td>
                    <td className="px-4 py-3 text-gray-400">{v.utmSource || v.referrer || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(v.createdAt).toLocaleString("tr-TR")}
                    </td>
                  </tr>
                ))}
                {visits.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-600">
                      Henüz ziyaret yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
