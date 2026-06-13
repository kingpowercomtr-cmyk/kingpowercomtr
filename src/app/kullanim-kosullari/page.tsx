import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | KingPower",
  description: "KingPower web sitesi kullanım koşulları ve sorumluluk reddi.",
};

export default function KullanimKosullari() {
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

        <h1 className="text-4xl font-bold mb-3">Kullanım Koşulları</h1>
        <div className="w-16 h-1 bg-gold-500 rounded-full mb-8" />

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Kabul</h2>
            <p>
              Bu web sitesini ziyaret etmek veya sipariş vermek suretiyle aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız. Koşulları kabul etmiyorsanız siteyi kullanmaktan vazgeçiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Ürün Yasal Uyarısı</h2>
            <p>
              KingPower bir <strong className="text-gold-400">takviye edici gıdadır</strong>; ilaç değildir. Herhangi bir hastalığın teşhisi, tedavisi veya önlenmesi amacıyla kullanılamaz ve bu amaçla pazarlanmaz. Ürünü kullanmadan önce bir sağlık profesyoneline danışmanız tavsiye edilir. Özellikle kalp hastalığı, tansiyon, diyabet ve ilaç kullanan bireyler doktorlarına başvurmalıdır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Kullanıcı Yükümlülükleri</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Siteyi yalnızca yasal amaçlarla kullanacağınızı kabul edersiniz.</li>
              <li>Siteye zarar verecek veya işleyişini bozacak girişimlerde bulunmamayı taahhüt edersiniz.</li>
              <li>Sipariş formuna doğru ve güncel bilgileri girmeyi kabul edersiniz.</li>
              <li>18 yaşından büyük olduğunuzu beyan edersiniz.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Fikri Mülkiyet</h2>
            <p>
              Sitede yer alan tüm içerikler (metin, görsel, logo, tasarım) KingPower&#39;ın münhasır mülkiyetindedir. Yazılı izin alınmaksızın çoğaltılamaz, dağıtılamaz veya türev eserler oluşturulamaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Sorumluluk Sınırlaması</h2>
            <p>
              KingPower, sitenin kesintisiz veya hatasız çalışacağını garanti etmez. Teknik aksaklıklar, üçüncü taraf içerikleri veya kullanıcının hatalı kullanımından doğan zararlardan sorumlu tutulamaz. Ürünün bireysel etkileri kişiden kişiye farklılık gösterebilir; sonuçlar garanti edilmez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Bağlantılı Siteler</h2>
            <p>
              Sitemizde üçüncü taraf web sitelerine bağlantılar bulunabilir. Bu sitelerin içerik ve gizlilik politikalarından KingPower sorumlu değildir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Koşulların Değiştirilmesi</h2>
            <p>
              KingPower, bu koşulları önceden haber vermeksizin güncelleme hakkını saklı tutar. Güncel versiyona her zaman bu sayfadan ulaşabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Uygulanacak Hukuk</h2>
            <p>
              Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Herhangi bir uyuşmazlıkta Türk Mahkemeleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. İletişim</h2>
            <p>
              Kullanım koşullarına ilişkin sorularınız için <strong className="text-white">destek@kingpower.com.tr</strong> adresine yazabilirsiniz.
            </p>
          </section>
        </div>

        <p className="mt-12 text-xs text-gray-600">Son güncelleme: Haziran 2025</p>
      </div>
    </div>
  );
}
