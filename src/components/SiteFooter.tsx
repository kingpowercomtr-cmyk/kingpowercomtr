import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 text-gray-500 text-sm">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="text-2xl font-black text-white mb-3 tracking-tight">
            KING<span className="text-yellow-500">POWER</span>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed max-w-xs">
            Doğal bitkisel formül ile erkek performansını destekleyen premium takviye. Gizli kargo, kapıda ödeme.
          </p>
          <p className="mt-4 text-xs text-gray-700">
            Bu ürün bir ilaç değildir, takviye edici gıdadır. Hastalıkların önlenmesi veya tedavisi amacıyla kullanılmaz.
          </p>
        </div>

        {/* Sayfalar */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Sayfalar</h4>
          <ul className="space-y-2.5">
            <li><a href="#hero" className="hover:text-white transition-colors">Ana Sayfa</a></li>
            <li><a href="#yorumlar" className="hover:text-white transition-colors">Yorumlar</a></li>
            <li><a href="#siparis" className="hover:text-white transition-colors">Sipariş Ver</a></li>
            <li><a href="#sss" className="hover:text-white transition-colors">SSS</a></li>
          </ul>
        </div>

        {/* Yasal */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Yasal</h4>
          <ul className="space-y-2.5">
            <li><Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
            <li><Link href="/iade-sartlari" className="hover:text-white transition-colors">İade Şartları</Link></li>
            <li><Link href="/mesafeli-satis" className="hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
            <li><Link href="/kullanim-kosullari" className="hover:text-white transition-colors">Kullanım Koşulları</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-700">
          <span>&copy; 2026 KingPower. Tüm hakları saklıdır.</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Kapıda Ödeme · Ücretsiz Kargo · Gizli Paketleme</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
