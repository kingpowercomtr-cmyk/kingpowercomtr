import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade Şartları | KingPower",
  description: "KingPower ürünleri için iade ve değişim koşulları.",
};

export default function IadeSartlari() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors mb-10 text-sm font-semibold"
        >
          ← Ana Sayfaya Dön
        </Link>

        <h1 className="text-4xl font-bold mb-3">İade Şartları</h1>
        <div className="w-16 h-1 bg-gold-500 rounded-full mb-8" />

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Genel Bilgi</h2>
            <p>
              KingPower olarak müşteri memnuniyetini her şeyin önünde tutuyoruz. Ürünlerimize ilişkin iade ve değişim işlemleri 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında yürütülmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Cayma Hakkı</h2>
            <p>
              Teslim tarihinden itibaren <strong className="text-gold-400">14 (on dört) takvim günü</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkınız bulunmaktadır. Cayma hakkını kullanmak için ürünün kullanılmamış, orijinal ambalajında ve sağlık bütünlüğü bozulmamış olması gerekmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. İade Edilemeyen Ürünler</h2>
            <p>Aşağıdaki durumlarda iade kabul edilmemektedir:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Ambalajı açılmış, kullanılmış veya mühürü kırılmış ürünler.</li>
              <li>Hijyen ve sağlık gerekçesiyle iadesi mümkün olmayan ürünler.</li>
              <li>Teslimattan itibaren 14 günlük yasal süre aşılmış siparişler.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. İade Süreci</h2>
            <p>
              İade talebinde bulunmak için sipariş numaranızı ve iade gerekçenizi belirterek <strong className="text-white">destek@kingpower.com.tr</strong> adresine e-posta gönderiniz. Talebiniz en geç <strong className="text-gold-400">3 iş günü</strong> içinde değerlendirilerek size dönüş yapılır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Geri Ödeme</h2>
            <p>
              Onaylanan iade işlemlerinde ödeme tutarı, iade onay tarihinden itibaren en geç <strong className="text-gold-400">7 iş günü</strong> içinde kullandığınız ödeme yöntemine iade edilir. Kargo bedeli alıcıya aittir; ancak ürünün hatalı ya da hasarlı çıkması durumunda kargo masrafları tarafımızca karşılanır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. İletişim</h2>
            <p>
              Herhangi bir sorunuz için <strong className="text-white">destek@kingpower.com.tr</strong> adresimizden bize ulaşabilirsiniz. Mesai saatleri: Pazartesi – Cumartesi, 09:00 – 18:00.
            </p>
          </section>
        </div>

        <p className="mt-12 text-xs text-gray-600">Son güncelleme: Haziran 2025</p>
      </div>
    </div>
  );
}
