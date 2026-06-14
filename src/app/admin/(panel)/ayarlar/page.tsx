"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SettingsData {
  pixelCode: string;
  profitPerOrder: number;
  cargoCompanies: string[];
  announcementText: string;
  announcementEnabled: boolean;
  packageBadgeText: string;
  contactPhone: string;
  contactWhatsapp: string;
  adminNote: string;
  soundNotifications: boolean;
}

const EMPTY: SettingsData = {
  pixelCode: "",
  profitPerOrder: 149,
  cargoCompanies: [],
  announcementText: "",
  announcementEnabled: false,
  packageBadgeText: "",
  contactPhone: "",
  contactWhatsapp: "",
  adminNote: "",
  soundNotifications: true,
};

export default function AdminAyarlar() {
  const router = useRouter();
  const [data, setData] = useState<SettingsData>(EMPTY);
  const [newCargo, setNewCargo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/giris");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setData({
            pixelCode: d.pixelCode || "",
            profitPerOrder: d.profitPerOrder ?? 149,
            cargoCompanies: d.cargoCompanies || [],
            announcementText: d.announcementText || "",
            announcementEnabled: !!d.announcementEnabled,
            packageBadgeText: d.packageBadgeText || "",
            contactPhone: d.contactPhone || "",
            contactWhatsapp: d.contactWhatsapp || "",
            adminNote: d.adminNote || "",
            soundNotifications: d.soundNotifications !== false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const save = async (payload: Record<string, unknown>, successMsg: string) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) setMessage(successMsg);
      else {
        const d = await res.json().catch(() => ({}));
        setMessage(d.error || "Kayıt başarısız.");
      }
    } catch {
      setMessage("Bağlantı hatası.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const handleSavePixel = (e: React.FormEvent) => {
    e.preventDefault();
    save({ pixelCode: data.pixelCode }, "Piksel kodu kaydedildi — landing sayfasında aktif.");
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    save({
      profitPerOrder: data.profitPerOrder,
      announcementText: data.announcementText,
      announcementEnabled: data.announcementEnabled,
      packageBadgeText: data.packageBadgeText,
      contactPhone: data.contactPhone,
      contactWhatsapp: data.contactWhatsapp,
      adminNote: data.adminNote,
      soundNotifications: data.soundNotifications,
    }, "Ayarlar kaydedildi.");
  };

  const handleSaveCargo = (e: React.FormEvent) => {
    e.preventDefault();
    save({ cargoCompanies: data.cargoCompanies }, "Kargo firmaları güncellendi.");
  };

  const handleAddCargo = () => {
    const trimmed = newCargo.trim();
    if (!trimmed) return;
    if (data.cargoCompanies.includes(trimmed)) {
      setNewCargo("");
      return;
    }
    setData((d) => ({ ...d, cargoCompanies: [...d.cargoCompanies, trimmed] }));
    setNewCargo("");
  };

  const handleRemoveCargo = (name: string) => {
    setData((d) => ({ ...d, cargoCompanies: d.cargoCompanies.filter((c) => c !== name) }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setMessage("Şifre en az 4 karakter olmalıdır.");
      setTimeout(() => setMessage(""), 4000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Şifreler eşleşmiyor.");
      setTimeout(() => setMessage(""), 4000);
      return;
    }
    await save({ newPassword }, "Şifre başarıyla değiştirildi.");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (loading) {
    return <div className="text-gray-400 text-center py-20">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
        <p className="text-gray-500 text-sm mt-1">Site, panel ve hesap ayarlarını buradan yönetin</p>
      </div>

      {message && (
        <div className={`text-sm rounded-lg px-4 py-3 border ${
          message.includes("başarı") || message.includes("kaydedildi") || message.includes("güncellendi") || message.includes("değiştirildi")
            ? "text-green-400 border-green-500/30 bg-green-500/10"
            : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
        }`}>
          {message}
        </div>
      )}

      {/* Genel Ayarlar */}
      <form onSubmit={handleSaveGeneral} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">📣 Site Duyurusu</h2>
          <p className="text-xs text-gray-500 mb-3">
            Ana sayfanın üstünde gösterilecek kampanya duyurusu (örn. hediye sprey kampanyası).
          </p>
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => setData((d) => ({ ...d, announcementEnabled: !d.announcementEnabled }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${data.announcementEnabled ? "bg-yellow-500" : "bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${data.announcementEnabled ? "translate-x-6" : ""}`} />
            </button>
            <span className="text-sm text-gray-300">{data.announcementEnabled ? "Duyuru aktif" : "Duyuru kapalı"}</span>
          </div>
          <input
            type="text"
            value={data.announcementText}
            onChange={(e) => setData((d) => ({ ...d, announcementText: e.target.value }))}
            placeholder="🎁 2 ve üzeri kutu alımlarında geciktirici sprey HEDİYE!"
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="border-t border-white/5 pt-5">
          <h2 className="text-lg font-bold text-white mb-1">🏷️ Paket Seçim Etiketi</h2>
          <p className="text-xs text-gray-500 mb-3">
            Sipariş formunda &quot;En Avantajlı / En Çok Tercih Edilen&quot; paketin üstünde gösterilen etiket.
          </p>
          <input
            type="text"
            value={data.packageBadgeText}
            onChange={(e) => setData((d) => ({ ...d, packageBadgeText: e.target.value }))}
            placeholder="🔥 En Çok Tercih Edilen + Sprey Hediye 🎁"
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="border-t border-white/5 pt-5">
          <h2 className="text-lg font-bold text-white mb-1">💰 Sipariş Başına Net Kâr</h2>
          <p className="text-xs text-gray-500 mb-3">
            Panelde &quot;Net Kâr&quot; hesaplamalarında kullanılan, sipariş başına maliyetiniz düşüldükten sonraki kâr (TL).
          </p>
          <div className="flex items-center gap-2 max-w-xs">
            <span className="text-gray-400">₺</span>
            <input
              type="number"
              value={data.profitPerOrder}
              onChange={(e) => setData((d) => ({ ...d, profitPerOrder: Number(e.target.value) }))}
              min={0}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        <div className="border-t border-white/5 pt-5">
          <h2 className="text-lg font-bold text-white mb-1">📞 İletişim Bilgileri</h2>
          <p className="text-xs text-gray-500 mb-3">
            Müşteri iletişimi için kullanılan telefon ve WhatsApp numaraları.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Telefon</label>
              <input
                type="text"
                value={data.contactPhone}
                onChange={(e) => setData((d) => ({ ...d, contactPhone: e.target.value }))}
                placeholder="0531 495 5170"
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">WhatsApp Numarası</label>
              <input
                type="text"
                value={data.contactWhatsapp}
                onChange={(e) => setData((d) => ({ ...d, contactWhatsapp: e.target.value }))}
                placeholder="905314955170"
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-5">
          <h2 className="text-lg font-bold text-white mb-1">🔔 Bildirimler</h2>
          <p className="text-xs text-gray-500 mb-3">
            Yeni bir sipariş geldiğinde panelde sesli uyarı çalsın mı?
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setData((d) => ({ ...d, soundNotifications: !d.soundNotifications }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${data.soundNotifications ? "bg-yellow-500" : "bg-gray-700"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${data.soundNotifications ? "translate-x-6" : ""}`} />
            </button>
            <span className="text-sm text-gray-300">{data.soundNotifications ? "Ses bildirimi açık" : "Ses bildirimi kapalı"}</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-5">
          <h2 className="text-lg font-bold text-white mb-1">📝 Panel Notu</h2>
          <p className="text-xs text-gray-500 mb-3">
            Kendinize özel notlar / hatırlatmalar. Sadece siz görürsünüz.
          </p>
          <textarea
            value={data.adminNote}
            onChange={(e) => setData((d) => ({ ...d, adminNote: e.target.value }))}
            rows={4}
            placeholder="Örn: Kargo firmasını ayda bir kontrol et, stok azaldığında tedarikçiyi ara..."
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-yellow-500 resize-y min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-bold rounded-lg hover:from-yellow-400 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>

      {/* Kargo Firmaları */}
      <form onSubmit={handleSaveCargo} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">🚚 Kargo Firmaları</h2>
          <p className="text-xs text-gray-500 mb-3">
            Sipariş yönetiminde kargo firması seçim listesinde gösterilecek firmalar.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.cargoCompanies.map((c) => (
            <span key={c} className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-full px-3 py-1.5 text-sm text-gray-300">
              {c}
              <button
                type="button"
                onClick={() => handleRemoveCargo(c)}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
          {data.cargoCompanies.length === 0 && <p className="text-gray-600 text-sm">Henüz kargo firması eklenmemiş.</p>}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCargo}
            onChange={(e) => setNewCargo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCargo();
              }
            }}
            placeholder="Yeni kargo firması adı..."
            className="flex-1 bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-yellow-500"
          />
          <button
            type="button"
            onClick={handleAddCargo}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-gray-800 rounded-xl text-sm text-gray-300 font-semibold transition-colors"
          >
            + Ekle
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-bold rounded-lg hover:from-yellow-400 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Kargo Listesini Kaydet"}
        </button>
      </form>

      {/* Şifre Değiştirme */}
      <form onSubmit={handleChangePassword} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">🔒 Admin Şifresini Değiştir</h2>
          <p className="text-xs text-gray-500 mb-3">
            Panel girişinde kullanılan şifrenizi güncelleyin.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Yeni Şifre</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Şifreyi Onayla</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-500 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Şifreyi Değiştir"}
        </button>
      </form>

      {/* Piksel Kodu */}
      <form onSubmit={handleSavePixel} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">📊 Meta / TikTok Piksel Kodu</h2>
          <p className="text-xs text-gray-500 mb-3">
            Meta Pixel veya TikTok Pixel&apos;in tam script kodunu buraya yapıştırın. Kaydettikten sonra
            landing sayfasının head bölümüne otomatik eklenir.
          </p>
          <textarea
            value={data.pixelCode}
            onChange={(e) => setData((d) => ({ ...d, pixelCode: e.target.value }))}
            rows={10}
            placeholder={'<!-- Meta Pixel Code -->\n<script>...</script>\n<noscript>...</noscript>'}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 font-mono focus:outline-none focus:border-yellow-500 resize-y min-h-[160px]"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-bold rounded-lg hover:from-yellow-400 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Piksel Kodunu Kaydet"}
        </button>
      </form>
    </div>
  );
}
