"use client";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, STATUS_LABELS, CARGO_COMPANIES } from "@/lib/order-status";
import AdminAddOrderModal from "@/components/admin/AdminAddOrderModal";
import AdminEditOrderModal from "@/components/admin/AdminEditOrderModal";

export interface AdminOrder {
  id: number;
  code: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  paymentType: string;
  packageType: string;
  packageLabel: string;
  price: number;
  status: string;
  cargoCompany: string | null;
  trackingCode: string | null;
  createdAt: string;
}

interface AdminOrdersTableProps {
  showExport?: boolean;
  limit?: number;
}

export default function AdminOrdersTable({ showExport = true, limit = 100 }: AdminOrdersTableProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, { cargoCompany: string; trackingCode: string }>>({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(limit) });
    if (filterStatus) params.set("status", filterStatus);
    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.status === 401) {
      router.push("/admin/giris");
      return;
    }
    const data = await res.json();
    setOrders(data.orders || []);
    setTotal(data.total || 0);
    const nextDrafts: Record<number, { cargoCompany: string; trackingCode: string }> = {};
    (data.orders || []).forEach((o: AdminOrder) => {
      nextDrafts[o.id] = {
        cargoCompany: o.cargoCompany || "",
        trackingCode: o.trackingCode || "",
      };
    });
    setDrafts(nextDrafts);
    setLoading(false);
  }, [filterStatus, limit, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const patchOrder = async (
    id: number,
    payload: { status?: string; cargoCompany?: string; trackingCode?: string }
  ) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) await fetchOrders();
    } finally {
      setSavingId(null);
    }
  };

  const deleteOrder = async (id: number, code: string) => {
    if (!window.confirm(`${code} kodlu siparişi silmek istediğinize emin misiniz?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (expandedId === id) setExpandedId(null);
        await fetchOrders();
      }
    } finally {
      setDeletingId(null);
    }
  };

  const exportCsv = () => {
    const params = new URLSearchParams({ export: "csv" });
    if (filterStatus) params.set("status", filterStatus);
    window.location.href = `/api/admin/orders?${params}`;
  };

  const paymentLabel = (type: string) => (type === "nakit" ? "Kapıda Nakit" : "Kapıda Kart");

  const toggleRow = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Toplam <span className="text-white font-semibold">{total}</span> sipariş
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold rounded-lg transition-colors"
          >
            + Yeni Sipariş
          </button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="">Tüm Durumlar</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {showExport && (
            <button
              type="button"
              onClick={exportCsv}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-colors"
            >
              📥 Excel / CSV İndir
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-16">Siparişler yükleniyor...</div>
      ) : (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1200px]">
              <thead>
                <tr className="text-gray-500 border-b border-white/10 text-xs uppercase bg-black/30">
                  <th className="w-8 px-2 py-3" />
                  <th className="text-left px-3 py-3">Kod</th>
                  <th className="text-left px-3 py-3">Ad Soyad</th>
                  <th className="text-left px-3 py-3">Telefon</th>
                  <th className="text-left px-3 py-3">Şehir / İlçe</th>
                  <th className="text-left px-3 py-3 min-w-[160px]">Açık Adres</th>
                  <th className="text-left px-3 py-3">Tarih</th>
                  <th className="text-left px-3 py-3">Paket</th>
                  <th className="text-right px-3 py-3">Tutar</th>
                  <th className="text-left px-3 py-3">Ödeme</th>
                  <th className="text-left px-3 py-3">Durum</th>
                  <th className="text-left px-3 py-3">Kargo</th>
                  <th className="text-left px-3 py-3">Takip Kodu</th>
                  <th className="px-3 py-3">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((o) => {
                  const draft = drafts[o.id] || { cargoCompany: "", trackingCode: "" };
                  const isExpanded = expandedId === o.id;
                  return (
                    <Fragment key={o.id}>
                      <tr
                        onClick={() => toggleRow(o.id)}
                        className={`align-top cursor-pointer transition-colors ${
                          isExpanded ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-2 py-3 text-gray-500" onClick={stopProp}>
                          <button
                            type="button"
                            onClick={() => toggleRow(o.id)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-yellow-400"
                            aria-label="Detayları aç"
                          >
                            <span
                              className={`inline-block transition-transform text-xs ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            >
                              ▶
                            </span>
                          </button>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-yellow-400 whitespace-nowrap">
                          {o.code}
                        </td>
                        <td className="px-3 py-3 text-white font-medium whitespace-nowrap">{o.fullName}</td>
                        <td className="px-3 py-3 text-gray-300 whitespace-nowrap">{o.phone}</td>
                        <td className="px-3 py-3 text-gray-400 whitespace-nowrap">
                          {o.city} / {o.district}
                        </td>
                        <td className="px-3 py-3 text-gray-400 max-w-[200px]">
                          <span className="line-clamp-2" title={o.address}>
                            {o.address}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(o.createdAt).toLocaleString("tr-TR")}
                        </td>
                        <td className="px-3 py-3 text-gray-300">{o.packageLabel}</td>
                        <td className="px-3 py-3 text-right text-green-400 font-bold whitespace-nowrap">
                          ₺{o.price.toLocaleString("tr-TR")}
                        </td>
                        <td className="px-3 py-3 text-gray-400 whitespace-nowrap" onClick={stopProp}>
                          {paymentLabel(o.paymentType)}
                        </td>
                        <td className="px-3 py-3" onClick={stopProp}>
                          <select
                            value={ORDER_STATUSES.some((s) => s.value === o.status) ? o.status : "yeni_siparis"}
                            onChange={(e) => patchOrder(o.id, { status: e.target.value })}
                            disabled={savingId === o.id}
                            className="bg-[#1a1a1a] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500 min-w-[120px]"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                            {!ORDER_STATUSES.some((s) => s.value === o.status) && (
                              <option value={o.status}>{STATUS_LABELS[o.status] || o.status}</option>
                            )}
                          </select>
                        </td>
                        <td className="px-3 py-3" onClick={stopProp}>
                          <select
                            value={draft.cargoCompany}
                            onChange={(e) =>
                              setDrafts((d) => ({
                                ...d,
                                [o.id]: { ...draft, cargoCompany: e.target.value },
                              }))
                            }
                            className="bg-[#1a1a1a] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none min-w-[130px]"
                          >
                            <option value="">Firma seç</option>
                            {CARGO_COMPANIES.filter(Boolean).map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3" onClick={stopProp}>
                          <input
                            type="text"
                            value={draft.trackingCode}
                            onChange={(e) =>
                              setDrafts((d) => ({
                                ...d,
                                [o.id]: { ...draft, trackingCode: e.target.value },
                              }))
                            }
                            placeholder="Takip no"
                            className="bg-[#1a1a1a] border border-white/10 rounded px-2 py-1.5 text-xs text-white w-28 focus:outline-none focus:border-yellow-500"
                          />
                        </td>
                        <td className="px-3 py-3" onClick={stopProp}>
                          <div className="flex flex-col gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingOrder(o)}
                              className="px-2 py-1.5 text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 whitespace-nowrap"
                            >
                              ✏️ Düzenle
                            </button>
                            <button
                              type="button"
                              disabled={savingId === o.id}
                              onClick={() =>
                                patchOrder(o.id, {
                                  cargoCompany: draft.cargoCompany,
                                  trackingCode: draft.trackingCode,
                                })
                              }
                              className="px-2 py-1.5 text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded hover:bg-yellow-500/30 disabled:opacity-50 whitespace-nowrap"
                            >
                              {savingId === o.id ? "..." : "Kaydet"}
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === o.id}
                              onClick={() => deleteOrder(o.id, o.code)}
                              className="px-2 py-1.5 text-xs font-bold bg-red-900/30 text-red-400 border border-red-700/40 rounded hover:bg-red-900/50 disabled:opacity-50 whitespace-nowrap"
                            >
                              {deletingId === o.id ? "..." : "Sil"}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-black/40">
                          <td colSpan={15} className="px-6 py-4 border-t border-white/5">
                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Açık Adres</p>
                                <p className="text-gray-200 leading-relaxed">{o.address}</p>
                              </div>
                              <div className="text-gray-400 space-y-1">
                                <p>
                                  <span className="text-gray-500">Şehir / İlçe:</span> {o.city} / {o.district}
                                </p>
                                <p>
                                  <span className="text-gray-500">Telefon:</span> {o.phone}
                                </p>
                                <p>
                                  <span className="text-gray-500">Sipariş Kodu:</span>{" "}
                                  <span className="font-mono text-yellow-400">{o.code}</span>
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={15} className="text-center py-12 text-gray-600">
                      Henüz sipariş yok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <AdminAddOrderModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={fetchOrders}
      />
      <AdminEditOrderModal
        order={editingOrder}
        onClose={() => setEditingOrder(null)}
        onSaved={fetchOrders}
      />
    </div>
  );
}
