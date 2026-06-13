import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | KingPower",
  description: "KingPower kişisel verilerin korunması ve gizlilik politikası.",
};

export default function GizlilikPolitikasi() {
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

        <h1 className="text-4xl font-bold mb-3">Gizlilik Politikası</h1>
        <div className="w-16 h-1 bg-gold-500 rounded-full mb-8" />

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Veri Sorumlusu</h2>
            <p>
              KingPower (bundan böyle &ldquo;Şirket&rdquo; olarak anılacaktır), 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) kapsamında veri sorumlusu sıfatını taşımaktadır. Kişisel verileriniz bu politika çerçevesinde işlenmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Toplanan Veriler</h2>
            <p>Siparişleriniz sırasında aşağıdaki veriler toplanmaktadır:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Ad ve soyad</li>
              <li>Telefon numarası</li>
              <li>Teslimat adresi</li>
              <li>Sipariş geçmişi ve tercihler</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Verilerin İşlenme Amaçları</h2>
            <p>Kişisel verileriniz yalnızca aşağıdaki amaçlarla işlenmektedir:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Siparişinizin hazırlanması ve kargoya verilmesi.</li>
              <li>Müşteri desteği ve iade işlemleri.</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
              <li>Açık rızanız dahilinde pazarlama iletişimleri.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Verilerin Aktarımı</h2>
            <p>
              Kişisel verileriniz; kargo firmaları (teslimat amacıyla), ödeme altyapı sağlayıcıları ve yasal zorunluluklar kapsamında yetkili kamu kurumları dışında üçüncü taraflarla paylaşılmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Veri Güvenliği</h2>
            <p>
              Verilerinizin güvenliği için SSL şifreleme, erişim kontrolü ve güvenli sunucu altyapısı gibi teknik tedbirler uygulanmaktadır. Veriler, ilgili mevzuat tarafından öngörülen süreler boyunca saklanır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Haklarınız (KVKK Madde 11)</h2>
            <p>KVKK kapsamında aşağıdaki haklarınızı kullanabilirsiniz:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Verilerinizin işlenip işlenmediğini öğrenme.</li>
              <li>Yanlış veya eksik verilerin düzeltilmesini talep etme.</li>
              <li>Verilerin silinmesini veya yok edilmesini isteme.</li>
              <li>İşlemeye itiraz etme ve veri taşınabilirliği talep etme.</li>
            </ul>
            <p className="mt-3">
              Talepleriniz için <strong className="text-white">kvkk@kingpower.com.tr</strong> adresine yazılı başvuruda bulunabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Çerezler (Cookies)</h2>
            <p>
              Sitemiz; performans iyileştirme ve kullanıcı deneyimi amacıyla zorunlu çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Politika Değişiklikleri</h2>
            <p>
              Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler e-posta veya site bildirimi yoluyla paylaşılır.
            </p>
          </section>
        </div>

        <p className="mt-12 text-xs text-gray-600">Son güncelleme: Haziran 2025</p>
      </div>
    </div>
  );
}
