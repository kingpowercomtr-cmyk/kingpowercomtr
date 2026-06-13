import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi | KingPower",
  description: "KingPower mesafeli satış sözleşmesi ve yasal şartlar.",
};

export default function MesafeliSatis() {
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

        <h1 className="text-4xl font-bold mb-3">Mesafeli Satış Sözleşmesi</h1>
        <div className="w-16 h-1 bg-gold-500 rounded-full mb-8" />

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">MADDE 1 – TARAFLAR</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#111] border border-gray-800">
                <p className="text-gold-400 font-semibold mb-1">SATICI</p>
                <p>Ticari Adı: KingPower</p>
                <p>E-posta: destek@kingpower.com.tr</p>
              </div>
              <div className="p-4 rounded-xl bg-[#111] border border-gray-800">
                <p className="text-gold-400 font-semibold mb-1">ALICI</p>
                <p>Sipariş formu aracılığıyla sisteme kayıt edilen ad, soyad, telefon ve adres bilgilerini sağlayan kişi.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">MADDE 2 – KONU</h2>
            <p>
              Bu sözleşme; Alıcının KingPower web sitesi üzerinden elektronik ortamda sipariş verdiği, aşağıda özellikleri ve satış fiyatı belirtilen ürünün satışı ve teslimatına ilişkin olarak 6502 Sayılı Tüketicinin Korunması Hakkındaki Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini kapsar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">MADDE 3 – ÜRÜN BİLGİLERİ</h2>
            <p>
              Ürün: KingPower Bitkisel Macun (Takviye Edici Gıda). Fiyat bilgileri sipariş anında onaylanan paket seçimine göre belirlenir ve siparişinize ait fatura ile teyit edilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">MADDE 4 – TESLİMAT</h2>
            <p>
              Ürün, sipariş onayından itibaren en geç <strong className="text-gold-400">3 iş günü</strong> içinde kargoya teslim edilir. Teslimat; alıcının sipariş sırasında bildirdiği adrese yapılır. Kargo süresi kargo firmasına ve coğrafi konuma göre değişebilir.
            </p>
            <p className="mt-2">
              Tüm ürünler <strong className="text-white">gizli paketleme</strong> ile gönderilir; paket üzerinde ürün içeriğini açıklayan herhangi bir ibare yer almaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">MADDE 5 – ÖDEME</h2>
            <p>
              Ödeme kapıda nakit veya kredi kartı (kapıda ödeme) ya da online ödeme yöntemleriyle gerçekleştirilebilir. Sipariş tamamlandıktan sonra ödeme tutarına ilişkin fatura Alıcıya iletilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">MADDE 6 – CAYMA HAKKI</h2>
            <p>
              Alıcı, ürünü teslim aldığı tarihten itibaren <strong className="text-gold-400">14 gün</strong> içinde herhangi bir gerekçe göstermeksizin sözleşmeden cayabilir. Cayma bildiriminin yazılı olarak <strong className="text-white">destek@kingpower.com.tr</strong> adresine iletilmesi gerekmektedir. Cayma hakkının kullanılabilmesi için ürünün kullanılmamış, orijinal ambalajında olması zorunludur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">MADDE 7 – GİZLİLİK</h2>
            <p>
              Alıcıya ait kişisel bilgiler Gizlilik Politikamız çerçevesinde korunmakta; üçüncü kişilerle yalnızca kargo ve ödeme altyapısı gerektirdiği ölçüde ve yasal zorunluluklar kapsamında paylaşılmaktadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">MADDE 8 – UYUŞMAZLIK ÇÖZÜMÜ</h2>
            <p>
              Bu sözleşmeden doğan uyuşmazlıklarda Türk hukuku uygulanır. Tüketici şikayetleri için Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">MADDE 9 – YÜRÜRLÜK</h2>
            <p>
              Alıcı, sipariş formunu doldurarak &ldquo;Siparişi Tamamla&rdquo; butonuna bastığı anda bu sözleşmenin tüm koşullarını okuduğunu, anladığını ve kabul ettiğini beyan etmiş sayılır.
            </p>
          </section>
        </div>

        <p className="mt-12 text-xs text-gray-600">Son güncelleme: Haziran 2025</p>
      </div>
    </div>
  );
}
