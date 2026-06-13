"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAyarlar() {
  const router = useRouter();
  const [pixelCode, setPixelCode] = useState("");
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
        if (d) setPixelCode(d.pixelCode || "");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pixelCode }),
      });
      if (res.ok) setMessage("Başarıyla kaydedildi — piksel landing sayfasında aktif.");
      else setMessage("Kayıt başarısız.");
    } catch {
      setMessage("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-center py-20">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Ayarlar</h1>
        <p className="text-gray-500 text-sm mt-1">Reklam pikseli ve izleme kodları</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Meta / TikTok Piksel Kodu
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Meta Pixel veya TikTok Pixel&apos;in tam script kodunu buraya yapıştırın. Kaydettikten sonra
            landing sayfasının head bölümüne otomatik eklenir.
          </p>
          <textarea
            value={pixelCode}
            onChange={(e) => setPixelCode(e.target.value)}
            rows={14}
            placeholder={'<!-- Meta Pixel Code -->\n<script>...</script>\n<noscript>...</noscript>'}
            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 font-mono focus:outline-none focus:border-yellow-500 resize-y min-h-[200px]"
          />
        </div>

        {message && (
          <p className={`text-sm ${message.includes("başarı") ? "text-green-400" : "text-yellow-400"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-bold rounded-lg hover:from-yellow-400 disabled:opacity-60"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
