"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { STATUS_LABELS } from "@/lib/order-status";

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  totalVisits: number;
  ordersByStatus: { status: string; _count: number }[];
  ordersByPackage: { packageType: string; _count: number }[];
  dailyData: { date: string; orders: number; revenue: number }[];
  eventCounts: { eventType: string; _count: number }[];
}

const COLORS = ["#d4af37", "#22c55e", "#3b82f6", "#f97316", "#a855f7"];

export default function AdminAnaliz() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/giris");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setData(d);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="text-gray-500 text-center py-20">Yükleniyor...</div>;
  if (!data) return null;

  const statusPieData = data.ordersByStatus.map((s) => ({
    name: STATUS_LABELS[s.status] || s.status,
    value: s._count,
  }));

  const eventBarData = data.eventCounts.map((e) => ({
    name: e.eventType.replace(/_/g, " "),
    count: e._count,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Analiz</h1>

      <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
        <h2 className="font-semibold text-gray-300 mb-4">Son 14 Gün — Sipariş & Gelir</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#6b7280", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }}
              labelStyle={{ color: "#ccc" }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="orders"
              stroke="#d4af37"
              strokeWidth={2}
              dot={false}
              name="Sipariş"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Gelir (₺)"
            />
            <Legend wrapperStyle={{ color: "#9ca3af" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-300 mb-4">Sipariş Durum Dağılımı</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusPieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-300 mb-4">Etkinlik Dağılımı</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={eventBarData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} width={90} />
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Adet" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
