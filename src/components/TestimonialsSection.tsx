"use client";
import Image from "next/image";

const TESTIMONIALS = [
  {
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Mehmet K.",
    location: "İstanbul",
    bubbles: [
      { text: "Arkadaşım tavsiye etti, biraz şüpheyle başladım ama gerçekten çok memnun kaldım 😄", time: "14:32" },
      { text: "İlk kullanımdan 30 dakika sonra etkisini hissettim. Kargo da çok hızlı geldi, paket tamamen sade ve gizliydi.", time: "14:33" },
    ],
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Ahmet Y.",
    location: "Ankara",
    bubbles: [
      { text: "2'li paketi aldım, hem fiyat hem de kalite açısından kesinlikle değer. İçerik tamamen doğal.", time: "16:45" },
      { text: "Gizli paketleme dedikleri doğru, komşular hiç anlamaz 😂 Tekrar sipariş vereceğim.", time: "16:46" },
    ],
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    name: "Burak T.",
    location: "İzmir",
    bubbles: [
      { text: "Sabah sipariş verdim, akşam kapıda. Bu kadar hızlı olacağını beklemiyordum!", time: "09:17" },
      { text: "Paket üzerinde sadece firmanın adı var, içeride ne olduğu belli değil. Çok memnunum! 👍", time: "09:18" },
    ],
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    name: "Serkan D.",
    location: "Bursa",
    bubbles: [
      { text: "2'li paketi denedim ve fiyat farkı gerçekten mantıklı. Düzenli kullandığımda enerji seviyem arttı.", time: "21:03" },
      { text: "Eşim de farkı fark etti 😏 Gizli kargo söz verdikleri gibi geldi. Herkese tavsiye ederim.", time: "21:04" },
    ],
  },
];

const RATING_BARS = [
  { stars: 5, pct: 87 },
  { stars: 4, pct: 10 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-[#0a0a0a]" data-section="yorumlar" id="yorumlar">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 uppercase tracking-widest mb-4">
            MÜŞTERİ YORUMLARI
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-3">10.000+ Mutlu Müşteri</h2>
          <p className="text-yellow-400 font-semibold text-lg">★★★★★ 4.9/5 — 2.340 değerlendirme</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-white/5 shadow-xl"
              style={{ background: "#0b141a" }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ background: "#1f2c34" }}>
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-green-500/50 flex-shrink-0 bg-zinc-800">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-xs" style={{ color: "#8696a0" }}>
                      {t.location} · doğrulanmış alıcı
                    </p>
                  </div>
                </div>
                <span className="bg-green-700/80 text-green-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  ✓ Onaylı
                </span>
              </div>

              <div className="px-4 py-5 space-y-3" style={{ background: "#0b141a" }}>
                {t.bubbles.map((b, bi) => (
                  <div key={bi} className="flex justify-start">
                    <div
                      className="max-w-[85%] rounded-2xl px-4 py-3"
                      style={{ background: "#1f2c34", borderTopLeftRadius: 4 }}
                    >
                      <p className="text-sm leading-relaxed" style={{ color: "#e9edef" }}>
                        {b.text}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1.5">
                        <span className="text-xs" style={{ color: "#8696a0" }}>
                          {b.time}
                        </span>
                        <span className="text-xs font-bold" style={{ color: "#53bdeb" }}>
                          ✓✓
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="text-center flex-shrink-0">
              <div className="text-6xl font-black text-white">4.9</div>
              <div className="flex gap-0.5 justify-center my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-yellow-400 text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500">2.340 değerlendirme</p>
            </div>
            <div className="flex-1 space-y-2 pt-1">
              {RATING_BARS.map((r) => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-8 text-right">{r.stars}★</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
