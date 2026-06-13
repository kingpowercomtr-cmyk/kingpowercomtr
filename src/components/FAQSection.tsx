"use client";
import { useState } from "react";
import { trackClick } from "@/lib/track";

const FAQS = [
  {
    q: "Hangi paketler mevcut?",
    a: "3 farklı paket seçeneğimiz bulunmaktadır: 1 Kutu (800 TL yerine 649 TL), 2 Kutu (1200 TL yerine 925 TL), 3 Kutu (1800 TL yerine 1300 TL). Tüm paketlerde ücretsiz kargo vardır. En çok tercih edilen ve en avantajlı paketimiz 2 Kutu seçeneğidir.",
  },
  {
    q: "Nasıl kullanılır?",
    a: "Aktiviteden yaklaşık 30-45 dakika önce 1 tatlı kaşığı macunu bol su ile tüketiniz. Kavanozu kullanmadan önce iyice karıştırınız. Günde 1 defadan fazla kullanmayınız.",
  },
  {
    q: "Kaç günde teslim edilir?",
    a: "Siparişiniz alındıktan sonra aynı iş günü kargoya verilir. Türkiye genelinde 1-3 iş günü içinde teslim edilir. Büyük şehirlerde çoğunlukla ertesi gün teslim gerçekleşmektedir.",
  },
  {
    q: "Kargo ücreti var mı?",
    a: "Hayır, tüm siparişlerde kargo tamamen ücretsizdir. Ek bir ücret ödemeniz gerekmemektedir.",
  },
  {
    q: "Gizli kargo mu?",
    a: "Evet, tüm siparişlerimiz gizli paketleme ile gönderilmektedir. Dış paket üzerinde ürün hakkında herhangi bir bilgi bulunmaz. Tamamen nötr, sade bir paketleme kullanılmaktadır.",
  },
  {
    q: "İade var mı?",
    a: "14 gün içinde iade hakkınız mevcuttur. Ürünün açılmamış ve kullanılmamış olması gerekmektedir. İade için sipariş takip kodunuzla bize WhatsApp üzerinden ulaşabilirsiniz.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [lookupCode, setLookupCode] = useState("");
  const [lookupResult, setLookupResult] = useState<{
    code?: string; statusLabel?: string; packageLabel?: string; createdAt?: string; error?: string;
  } | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupCode.trim()) return;
    setLookupLoading(true);
    setLookupResult(null);
    try {
      const res = await fetch(`/api/orders/lookup?code=${encodeURIComponent(lookupCode.trim())}`);
      const data = await res.json();
      setLookupResult(data);
    } catch {
      setLookupResult({ error: "Bağlantı hatası. Tekrar deneyin." });
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-[#0a0a0a] border-t border-white/5" data-section="sss" id="sss">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 uppercase tracking-widest mb-4">
            SSS
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-3">Sıkça Sorulan Sorular</h2>
          <p className="text-gray-400">Aklınızdaki soruların cevabı burada.</p>
        </div>

        {/* Accordion */}
        <div className="space-y-3 mb-8">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-white/8 rounded-xl overflow-hidden"
              style={{ background: "#0f0f0f" }}
            >
              <button
                onClick={() => {
                  setOpen(open === i ? null : i);
                  trackClick("faq_toggle", { index: i });
                }}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-semibold hover:bg-white/3 transition-colors"
              >
                <span>{faq.q}</span>
                <span
                  className={`ml-4 text-yellow-400 text-xl font-bold flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More questions link */}
        <p className="text-center text-gray-500 text-sm mb-16">
          Başka sorunuz mu var?{" "}
          <a href="#siparis" className="text-yellow-400 hover:underline font-medium">
            → Sipariş formundan iletin
          </a>
        </p>

        {/* Order Lookup */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-1">Sipariş Sorgula</h3>
          <p className="text-gray-400 text-sm mb-5">Sipariş takip kodunuzu girerek durumunu öğrenin.</p>
          <form onSubmit={handleLookup} className="flex gap-3">
            <input
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="Örn: KP-260601-123"
              className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors placeholder:text-gray-600 font-mono"
            />
            <button
              type="submit"
              disabled={lookupLoading}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-bold rounded-lg text-sm hover:from-yellow-400 hover:to-amber-300 transition-all disabled:opacity-60"
            >
              {lookupLoading ? "..." : "Sorgula"}
            </button>
          </form>

          {lookupResult && (
            <div className={`mt-4 p-4 rounded-xl text-sm ${lookupResult.error ? "bg-red-900/20 border border-red-700/30 text-red-400" : "bg-green-900/20 border border-green-700/30 text-green-300"}`}>
              {lookupResult.error ? (
                lookupResult.error
              ) : (
                <div className="space-y-1">
                  <p><span className="text-gray-400">Sipariş Kodu:</span> <span className="font-mono font-bold text-white">{lookupResult.code}</span></p>
                  <p><span className="text-gray-400">Durum:</span> <span className="font-bold text-green-300">{lookupResult.statusLabel}</span></p>
                  <p><span className="text-gray-400">Paket:</span> {lookupResult.packageLabel}</p>
                  <p><span className="text-gray-400">Tarih:</span> {lookupResult.createdAt ? new Date(lookupResult.createdAt).toLocaleString("tr-TR") : "—"}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
