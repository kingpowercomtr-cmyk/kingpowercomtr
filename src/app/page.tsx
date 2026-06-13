"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, Zap, Package } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import WhatsAppCTASection from "@/components/WhatsAppCTASection";
import OrderForm from "@/components/OrderForm";
import SuccessModal from "@/components/SuccessModal";
import SiteFooter from "@/components/SiteFooter";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import LiveOrderToast from "@/components/LiveOrderToast";

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState("1");
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const handleOrderSuccess = (code: string) => {
    setSuccessCode(code);
  };

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Success Modal */}
        {successCode && (
          <SuccessModal orderCode={successCode} onClose={() => setSuccessCode(null)} />
        )}

        {/* Hero */}
        <HeroSection onOrder={(pkg) => setSelectedPackage(pkg)} />

        {/* Benefits */}
        <section className="py-20 px-4 bg-black" data-section="avantajlar" id="avantajlar">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden KingPower?</h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: "Hızlı Etki", desc: "Sadece 30 dakika içinde etkisini hissetmeye başlayın." },
                { icon: ShieldCheck, title: "Klinik Onaylı", desc: "Güvenilir ve test edilmiş formül ile yan etkisiz kullanım." },
                { icon: CheckCircle2, title: "Doğal İçerik", desc: "Bitkisel özlerin eşsiz ve güçlü karışımı." },
                { icon: Package, title: "Gizli Kargo", desc: "Siparişleriniz içeriği belli olmayacak şekilde gizli paketlenir." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#111] border border-yellow-500/10 hover:border-yellow-500/30 transition-all group text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 border-y border-yellow-600/10" data-section="kullanim" id="kullanim">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nasıl Kullanılır?</h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
            </div>
            <div className="space-y-10">
              {[
                { step: "01", title: "Kullanım Zamanı", desc: "Aktiviteden yaklaşık 30-45 dakika önce 1 tatlı kaşığı tüketiniz." },
                { step: "02", title: "Tüketim Şekli", desc: "Tüketmeden önce kavanozu iyice karıştırın. Bol su ile yutulması tavsiye edilir." },
                { step: "03", title: "Etki Süresi", desc: "Etkisi 24 ile 48 saat arasında devam edebilir. Günde 1 defadan fazla kullanmayınız." },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start md:items-center">
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-800 opacity-50 flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-lg">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ingredients */}
        <section className="py-20 px-4 bg-black" data-section="icerikler" id="icerikler">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Gücün Kaynağı</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Doğanın en güçlü bitkilerini tek bir formülde birleştirdik.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                "Epimedium (Keşişkülahı)",
                "Kırmızı Ginseng",
                "Maca Kökü",
                "Tribulus (Demirdikeni)",
                "Harnup Özü",
                "Zencefil",
                "Arı Sütü",
                "Bal",
              ].map((ing, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#151515] border border-white/5 font-semibold text-gray-300 hover:text-yellow-400 hover:border-yellow-500/20 transition-colors text-sm"
                >
                  {ing}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Order Form */}
        <OrderForm initialPackage={selectedPackage} onSuccess={handleOrderSuccess} />

        {/* FAQ */}
        <FAQSection />

        {/* WhatsApp CTA */}
        <WhatsAppCTASection />

        {/* Footer */}
        <SiteFooter />

        <LiveOrderToast />
      </div>
    </AnalyticsProvider>
  );
}
