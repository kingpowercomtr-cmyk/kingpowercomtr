"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import ActiveVisitorSimulator from "@/components/admin/ActiveVisitorSimulator";

export const dynamic = 'force-dynamic';

interface RecentOrder {
  code: string;
  fullName: string;
  packageLabel: string;
  price: number;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  todayOrders: number;
  pendingCargo: number;
  monthlyRevenue: number;
  totalOrders: number;
  totalRevenue: number;
  totalVisits: number;
  netProfitTotal: number;
  netProfitToday: number;
  netProfitMonthly: number;
  profitPerOrder: number;
  weekOrders: number;
  prevWeekOrders: number;
  weekChangePercent: number | null;
  monthlyRevenueChangePercent: number | null;
  monthlyOrderChangePercent: number | null;
  dailyOrderChangePercent: number | null;
  topPackage: { label: string; count: number } | null;
  iadeOrders: number;
  iadeRate: number;
  ordersByPayment: { paymentType: string; count: number }[];
  ordersByCity: { city: string; count: number }[];
  recentOrders: RecentOrder[];
}

const EMPTY_STATS: DashboardStats = {
  todayOrders: 0,
  pendingCargo: 0,
  monthlyRevenue: 0,
  totalOrders: 0,
  totalRevenue: 0,
  totalVisits: 0,
  netProfitTotal: 0,
  netProfitToday: 0,
  netProfitMonthly: 0,
  profitPerOrder: 250,
  weekOrders: 0,
  prevWeekOrders: 0,
  weekChangePercent: null,
  monthlyRevenueChangePercent: null,
  monthlyOrderChangePercent: null,
  dailyOrderChangePercent: null,
  topPackage: null,
  iadeOrders: 0,
  iadeRate: 0,
  ordersByPayment: [],
  ordersByCity: [],
  recentOrders: [],
};

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

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1180, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // ignore - autoplay restrictions etc.
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const lastOrderCodeRef = useRef<string | null>(null);
  const firstLoadRef = useRef(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.soundNotifications === "boolean") setSoundEnabled(d.soundNotifications);
      })
      .catch(() => {});
  }, []);

  const load = () => {
    fetch("/api/admin/analytics")
      .then((r) => {
        if (r.ok) return r.json();
        return null;
      })
      .then((d) => {
        if (d) {
          setStats({
            todayOrders: d.todayOrders ?? 0,
            pendingCargo: d.pendingCargo ?? 0,
            monthlyRevenue: d.monthlyRevenue ?? 0,
            totalOrders: d.totalOrders ?? 0,
            totalRevenue: d.totalRevenue ?? 0,
            totalVisits: d.totalVisits ?? 0,
            netProfitTotal: d.totalProfitOrders ?? 0,
            netProfitToday: d.todayProfitOrders ?? 0,
            netProfitMonthly: d.monthlyProfitOrders ?? 0,
            profitPerOrder: d.profitPerOrder ?? 250,
            weekOrders: d.weekOrders ?? 0,
            prevWeekOrders: d.prevWeekOrders ?? 0,
            weekChangePercent: d.weekChangePercent ?? null,
            monthlyRevenueChangePercent: d.monthlyRevenueChangePercent ?? null,
            monthlyOrderChangePercent: d.monthlyOrderChangePercent ?? null,
            dailyOrderChangePercent: d.dailyOrderChangePercent ?? null,
            topPackage: d.topPackage ?? null,
            iadeOrders: d.iadeOrders ?? 0,
            iadeRate: d.iadeRate ?? 0,
            ordersByPayment: d.ordersByPayment ?? [],
            ordersByCity: d.ordersByCity ?? [],
            recentOrders: d.recentOrders ?? [],
          });

          // Yeni sipariş geldiyse ses çal
          const newest = d.recentOrders?.[0]?.code;
          if (newest) {
            if (!firstLoadRef.current && lastOrderCodeRef.current && newest !== lastOrderCodeRef.current && soundEnabled) {
              playNotificationSound();
            }
            lastOrderCodeRef.current = newest;
          }
          firstLoadRef.current = false;
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("API henüz canlıda hazır değil:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundEnabled]);

  if (loading) return <div className="text-gray-400 text-center mt-20">Veriler yükleniyor...</div>;

  const cashCount = stats.ordersByPayment.find((p) => p.paymentType === "nakit")?.count ?? 0;
  const cardCount = stats.ordersByPayment.find((p) => p.paymentType === "kart")?.count ?? 0;
  const paymentTotal = cashCount + cardCount;

  return (
    <div className="space-y-8 p-6 bg-black min-h-screen">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Genel Bakış (Canlı Panel)</h1>
          <p className="text-gray-500 text-sm mt-1">Canlı veriler · her 30 sn güncellenir</p>
        </div>
        <button
          onClick={() => setSoundEnabled((s) => !s)}
          className={`text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
            soundEnabled
              ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
              : "border-white/10 text-gray-500"
          }`}
          title="Yeni sipariş geldiğinde ses çalar"
        >
          {soundEnabled ? "🔔 Ses Bildirimi Açık" : "🔕 Ses Bildirimi Kapalı"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Bugünkü Siparişler"
          value={String(stats.todayOrders)}
          icon="📅"
          accent="text-blue-400"
          change={stats.dailyOrderChangePercent}
          changeLabel="dünden"
        />
        <StatCard
          label="Bekleyen Kargolar"
          value={String(stats.pendingCargo)}
          icon="🚚"
          accent="text-orange-400"
        />
        <StatCard
          label="Aylık Toplam Ciro"
          value={`₺${stats.monthlyRevenue.toLocaleString("tr-TR")}`}
          icon="💰"
          accent="text-yellow-400"
          change={stats.monthlyRevenueChangePercent}
          changeLabel="geçen aydan"
        />
        <StatCard
          label="Net Kârınız (Bugün)"
          value={`₺${stats.netProfitToday.toLocaleString("tr-TR")}`}
          icon="📈"
          accent="text-emerald-400"
          sub={`${stats.todayOrders} sipariş × ₺${stats.profitPerOrder}`}
        />
        <StatCard
          label="Net Kârınız (Bu Ay)"
          value={`₺${stats.netProfitMonthly.toLocaleString("tr-TR")}`}
          icon="💎"
          accent="text-emerald-400"
          sub="İade hariç tüm siparişler"
          change={stats.monthlyOrderChangePercent}
          changeLabel="sipariş adedi"
        />
        <StatCard
          label="Toplam Net Kâr"
          value={`₺${stats.netProfitTotal.toLocaleString("tr-TR")}`}
          icon="✅"
          accent="text-green-400"
          sub={`₺${stats.totalRevenue.toLocaleString("tr-TR")} ciro · ${stats.totalOrders} sipariş`}
        />
        <ActiveVisitorSimulator />
        <StatCard
          label="Bu Hafta Sipariş"
          value={String(stats.weekOrders)}
          icon="🗓️"
          accent="text-indigo-400"
          sub={`Geçen hafta: ${stats.prevWeekOrders}`}
          change={stats.weekChangePercent}
          changeLabel="geçen haftadan"
        />
        <StatCard
          label="En Çok Satan Paket"
          value={stats.topPackage ? stats.topPackage.label : "—"}
          icon="🏆"
          accent="text-pink-400"
          sub={stats.topPackage ? `${stats.topPackage.count} sipariş` : "Henüz veri yok"}
        />
        <StatCard
          label="İade Oranı"
          value={`%${stats.iadeRate}`}
          icon="↩️"
          accent={stats.iadeRate > 10 ? "text-red-400" : "text-gray-300"}
          sub={`${stats.iadeOrders} iade / ${stats.totalOrders} toplam`}
        />
      </div>

      {/* Ödeme tipi ve şehir dağılımı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Ödeme Tipi Dağılımı</p>
          {paymentTotal > 0 ? (
            <div className="space-y-3">
              <PaymentBar label="💵 Kapıda Nakit" count={cashCount} total={paymentTotal} color="bg-emerald-500" />
              <PaymentBar label="💳 Kapıda Kart" count={cardCount} total={paymentTotal} color="bg-blue-500" />
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Henüz veri yok.</p>
          )}
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Şehir Bazlı Sipariş Dağılımı</p>
          {stats.ordersByCity.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.ordersByCity.map((c) => (
                <div key={c.city} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{c.city}</span>
                  <span className="text-gray-500 font-bold">{c.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Henüz veri yok.</p>
          )}
        </div>
      </div>

      {/* Son aktiviteler */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Son Aktiviteler</p>
        {stats.recentOrders.length > 0 ? (
          <div className="space-y-2">
            {stats.recentOrders.map((o) => (
              <div key={o.code} className="flex items-center justify-between text-sm border-b border-white/5 last:border-0 pb-2 last:pb-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base">🛒</span>
                  <div className="min-w-0">
                    <p className="text-gray-200 truncate">
                      <span className="font-semibold">{o.fullName}</span> — {o.packageLabel}
                    </p>
                    <p className="text-xs text-gray-600">{o.code} · ₺{o.price.toLocaleString("tr-TR")}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">{timeAgo(o.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">Henüz sipariş yok.</p>
        )}
      </div>

      <div className="border-t border-white/10 pt-8">
        <h2 className="text-xl font-bold text-white mb-1">Sipariş Yönetimi</h2>
        <p className="text-gray-500 text-sm mb-6">
          Durum, kargo firması ve takip kodunu güncelleyin.
        </p>
        <AdminOrdersTable showExport limit={200} />
      </div>
    </div>
  );
}

function PaymentBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-300 mb-1.5">
        <span>{label}</span>
        <span className="font-bold">{count} (%{pct})</span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
  change,
  changeLabel,
}: {
  label: string;
  value: string;
  icon: string;
  accent: string;
  sub?: string;
  change?: number | null;
  changeLabel?: string;
}) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-yellow-500/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
          <p className={`text-2xl sm:text-3xl font-black ${accent}`}>{value}</p>
          {sub && <p className="text-xs text-gray-600 mt-2">{sub}</p>}
          {change !== null && change !== undefined && (
            <p className={`text-xs mt-2 font-semibold ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change >= 0 ? "▲" : "▼"} %{Math.abs(change)} {changeLabel}
            </p>
          )}
        </div>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}
