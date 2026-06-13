"use client";
import { useState } from "react";
import { PACKAGES } from "@/lib/packages";
import { TURKEY_CITIES, getDistrictsForCity } from "@/lib/turkey-locations";
import { ORDER_STATUSES } from "@/lib/order-status";
import { sanitizePhoneInput, isValidTurkishMobile } from "@/lib/order-utils";

interface AdminAddOrderModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AdminAddOrderModal({ open, onClose, onCreated }: AdminAddOrderModalProps) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    paymentType: "nakit",
    packageType: "2",
    status: "yeni_siparis",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const districts = getDistrictsForCity(form.city);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidTurkishMobile(form.phone)) {
      setError("Telefon tam 10 hane olmalı ve 5 ile başlamalı. Örn: 5468823229");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sipariş eklenemedi.");
        return;
      }
      onCreated();
      onClose();
      setForm({
        fullName: "",
        phone: "",
        city: "",
        district: "",
        address: "",
        paymentType: "nakit",
        packageType: "2",
        status: "yeni_siparis",
      });
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-1">Manuel Sipariş Ekle</h2>
        <p className="text-gray-500 text-sm mb-5">Panelden doğrudan yeni sipariş kaydı oluşturun.</p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-700/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Ad Soyad</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Telefon (10 hane)</label>
            <div className="flex gap-2">
              <span className="px-3 py-2.5 bg-[#0a0a0a] border border-gray-800 rounded-lg text-gray-400 text-sm font-mono">
                +90
              </span>
              <input
                required
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: sanitizePhoneInput(e.target.value) }))}
                placeholder="5468823229"
                maxLength={10}
                className={inputCls + " flex-1 font-mono"}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Şehir</label>
              <select
                required
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value, district: "" }))}
                className={inputCls}
              >
                <option value="">Seçin</option>
                {TURKEY_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">İlçe</label>
              <select
                required
                value={form.district}
                onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
                disabled={!form.city}
                className={inputCls + " disabled:opacity-50"}
              >
                <option value="">{form.city ? "Seçin" : "Önce şehir"}</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Açık Adres</label>
            <textarea
              required
              rows={2}
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className={inputCls + " resize-none"}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Paket</label>
              <select
                value={form.packageType}
                onChange={(e) => setForm((f) => ({ ...f, packageType: e.target.value }))}
                className={inputCls}
              >
                {PACKAGES.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label} — ₺{p.price}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Ödeme</label>
              <select
                value={form.paymentType}
                onChange={(e) => setForm((f) => ({ ...f, paymentType: e.target.value }))}
                className={inputCls}
              >
                <option value="nakit">Kapıda Nakit</option>
                <option value="kart">Kapıda Kart</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Durum</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className={inputCls}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 disabled:opacity-60"
            >
              {loading ? "Kaydediliyor..." : "Sipariş Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
