"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import ActiveVisitorSimulator from "@/components/admin/ActiveVisitorSimulator";

export const dynamic = 'force-dynamic';

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
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

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
          });
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
  }, []);

  if (loading) return <div className="text-gray-400 text-center mt-20">Veriler yükleniyor...</div>;

  return (
    <div className="space-y-8 p-6 bg-black min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-white">Genel Bakış (Canlı Panel)</h1>
        <p className="text-gray-500 text-sm mt-1">Canlı veriler · her 30 sn güncellenir</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Bugünkü Siparişler"
          value={String(stats.todayOrders)}
          icon="📅"
          accent="text-blue-400"
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
        />
        <StatCard
          label="Toplam Net Kâr"
          value={`₺${stats.netProfitTotal.toLocaleString("tr-TR")}`}
          icon="✅"
          accent="text-green-400"
          sub={`₺${stats.totalRevenue.toLocaleString("tr-TR")} ciro · ${stats.totalOrders} sipariş`}
        />
        <ActiveVisitorSimulator />
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

function StatCard({
  label,
  value,
  icon,
  accent,
  sub,
}: {
  label: string;
  value: string;
  icon: string;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-yellow-500/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</p>
          <p className={`text-2xl sm:text-3xl font-black ${accent}`}>{value}</p>
          {sub && <p className="text-xs text-gray-600 mt-2">{sub}</p>}
        </div>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}