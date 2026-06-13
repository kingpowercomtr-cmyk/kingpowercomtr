"use client";
import { trackClick } from "@/lib/track";
import { whatsappUrl, WHATSAPP_DISPLAY } from "@/lib/constants";

const FEATURES = [
  { icon: "🛡️", title: "Doğal İçerik", desc: "Klinik onaylı bitkisel formül" },
  { icon: "⚡", title: "Hızlı Etki", desc: "30 dakika içinde hissedersiniz" },
  { icon: "📦", title: "Gizli Kargo", desc: "Sade, markasız paketleme" },
  { icon: "💳", title: "Kapıda Ödeme", desc: "Teslimatta nakit veya kart" },
];

export default function WhatsAppCTASection() {
  return (
    <section className="py-24 px-4 bg-black border-t border-white/5" data-section="whatsapp-cta">
      <div className="max-w-3xl mx-auto text-center space-y-10">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black">
          Bizi Takip Et veya Direkt Mesaj At 👇
        </h2>

        {/* Big WhatsApp button */}
        <a
          href={whatsappUrl("Merhaba, KingPower Macun hakkında bilgi almak istiyorum.")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick("whatsapp_cta_big")}
          className="flex items-center justify-between gap-4 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#2ee872] hover:to-[#25D366] transition-all rounded-3xl px-8 py-6 shadow-2xl shadow-green-700/20 group"
        >
          <div className="flex items-center gap-4">
            {/* WhatsApp icon SVG */}
            <svg viewBox="0 0 32 32" className="w-12 h-12 fill-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.004 2.667C8.64 2.667 2.667 8.636 2.667 16c0 2.39.628 4.7 1.82 6.726L2.667 29.333l6.767-1.774A13.284 13.284 0 0 0 16.004 29.333c7.363 0 13.33-5.97 13.33-13.333 0-7.364-5.967-13.333-13.33-13.333zm0 2.666c5.887 0 10.664 4.773 10.664 10.667S21.891 26.667 16.004 26.667a10.65 10.65 0 0 1-5.468-1.504l-.392-.232-4.018 1.054 1.07-3.908-.258-.4A10.633 10.633 0 0 1 5.333 16c0-5.894 4.777-10.667 10.67-10.667zm-3.43 5.334c-.213 0-.557.08-.849.4-.293.32-1.12 1.094-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.24 3.6 5.547 4.906 2.747 1.084 3.307.867 3.906.813.6-.053 1.934-.787 2.2-1.547.267-.76.267-1.413.187-1.547-.08-.133-.293-.213-.614-.373-.32-.16-1.893-.934-2.186-1.04-.294-.107-.507-.16-.72.16-.214.32-.827 1.04-.987 1.253-.16.213-.32.24-.627.08-.306-.16-1.3-.48-2.48-1.527-.917-.813-1.534-1.813-1.714-2.12-.18-.306-.02-.473.134-.627.137-.137.306-.36.46-.547.153-.186.2-.32.306-.533.107-.214.054-.4-.026-.56-.08-.16-.72-1.733-.987-2.373-.253-.613-.514-.533-.72-.533h-.614z"/>
            </svg>
            <div className="text-left">
              <p className="text-white font-black text-2xl leading-tight">WhatsApp</p>
              <p className="text-green-100 text-sm font-medium">{WHATSAPP_DISPLAY}</p>
            </div>
          </div>
          <div className="text-white text-3xl group-hover:translate-x-1 transition-transform">→</div>
        </a>

        {/* Features row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-4 text-center hover:border-yellow-500/20 transition-colors">
              <div className="text-3xl mb-2">{f.icon}</div>
              <p className="text-white font-bold text-sm">{f.title}</p>
              <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
