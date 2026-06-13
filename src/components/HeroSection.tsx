"use client";
import { useState } from "react";
import Image from "next/image";
import { trackClick } from "@/lib/track";
import {
  PACKAGES,
  DEFAULT_PACKAGE_KEY,
  POPULAR_PACKAGE_KEY,
  discountPercent,
  formatPrice,
  type PackageKey,
} from "@/lib/packages";
import FreeShippingBadge from "@/components/FreeShippingBadge";
import StockUrgencyBar from "@/components/StockUrgencyBar";
import { whatsappUrl } from "@/lib/constants";

interface HeroSectionProps {
  onOrder: (pkg: string) => void;
}

export default function HeroSection({ onOrder }: HeroSectionProps) {
  const [selectedPkg, setSelectedPkg] = useState<PackageKey>(DEFAULT_PACKAGE_KEY);
  const active = PACKAGES.find((p) => p.key === selectedPkg)!;
  const discount = discountPercent(active);

  return (
    <section
      className="relative pt-16 pb-16 md:pt-24 md:pb-20 px-4 overflow-hidden border-b border-white/5"
      data-section="hero"
      id="hero"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-purple-950/20 to-[#0a0a0a] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center relative z-10">
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-amber-400 text-black tracking-wide shadow-lg shadow-yellow-500/20">
              YAZ KAMPANYASI · %{discount} İNDİRİM
            </span>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 font-medium">
              ⭐ 10.000+ Mutlu Müşteri
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 font-medium">
              🚚 KAPIDA ÖDEME
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
            KING POWER{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              Epimedyumlu Macun
            </span>{" "}
            — Erkek Gücünü Yeniden Keşfet
          </h1>

          <p className="text-lg text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Doğal bitkisel formül. Hızlı etki, uzun süreli performans.{" "}
            <span className="text-white font-medium">Ücretsiz kargo, kapıda ödeme.</span>
          </p>

          <div className="bg-[#0f1218] border border-yellow-500/30 rounded-2xl p-5 space-y-4 shadow-2xl shadow-yellow-500/5">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">KAMPANYA PAKETİ</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-white font-bold text-lg">
                {active.units} Adet KingPower Macun
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                  -%{discount}
                </span>
                <span className="text-gray-500 line-through text-sm">{formatPrice(active.origPrice)}</span>
                <span className="text-3xl font-black text-yellow-400">{formatPrice(active.price)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                {PACKAGES.map((p) => {
                  const isPopular = p.key === POPULAR_PACKAGE_KEY;
                  const isSelected = selectedPkg === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => {
                        setSelectedPkg(p.key);
                        onOrder(p.key);
                        trackClick("hero_package_pill", { pkg: p.key });
                      }}
                      className={`relative z-10 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/30"
                          : "bg-[#1a1a1a] text-gray-300 border-gray-600 hover:border-yellow-500/60 hover:text-white"
                      } ${isPopular && !isSelected ? "popular-package-pulse border-orange-500/60" : ""}`}
                    >
                      {p.shortLabel}
                      {isPopular && (
                        <span className="absolute -top-2 -right-1 text-[9px] font-black bg-orange-600 text-white px-1.5 py-0.5 rounded-full leading-none">
                          🔥
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-orange-300/90 font-semibold text-center md:text-left">
                🔥 <span className="text-orange-200">İki Kutu</span> — En avantajlı / en çok tercih edilen paket
              </p>
            </div>

            <FreeShippingBadge />

            <p className="text-green-400 text-sm font-medium flex items-center justify-center gap-1.5">
              <span className="text-green-500">✓</span> Kapıda ödeme · Gizli paketleme
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#111] border border-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">📦</div>
              <p className="text-xs text-orange-400 font-semibold">500+ paket bu hafta gönderildi</p>
            </div>
            <div className="bg-[#111] border border-white/5 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🔥</div>
              <p className="text-xs text-red-400 font-semibold">Stok azalıyor — kampanya bitmeden alın</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-yellow-400 text-lg">
                  ★
                </span>
              ))}
            </div>
            <span className="text-white font-bold">4.9/5</span>
            <span className="text-gray-500 text-sm">· 10.000+ Mutlu Müşteri</span>
          </div>

          <StockUrgencyBar className="pt-1" />

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                trackClick("hero_cta_order");
                onOrder(selectedPkg);
                window.setTimeout(() => {
                  const el = document.getElementById("siparis");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 50);
              }}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all transform hover:scale-[1.02] shadow-xl shadow-red-700/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              🛒 Hemen Sipariş Ver
            </button>
            <a
              href={whatsappUrl("Merhaba, KingPower Macun sipariş vermek istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick("hero_cta_whatsapp")}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-[1.02] shadow-xl shadow-green-700/20 flex items-center justify-center gap-2"
            >
              💬 WhatsApp ile Sipariş Ver
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative h-[480px] w-full rounded-3xl overflow-hidden border border-yellow-500/20 shadow-2xl shadow-yellow-500/10">
            <Image
              src="/hero.jpg"
              alt="KingPower — Erkek Gücünü Yeniden Keşfet"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-400 text-black text-xs font-black px-4 py-2 rounded-2xl shadow-lg shadow-yellow-500/40 rotate-2">
            {active.units}&apos;Lİ PAKET
          </div>
          <div className="absolute -bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Kampanya fiyatı</p>
              <p className="text-2xl font-black text-yellow-400">{formatPrice(active.price)}</p>
              <p className="text-xs text-gray-500 line-through">{formatPrice(active.origPrice)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Değerlendirme</p>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-white font-bold text-sm">4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
