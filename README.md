# KingPower Landing Page

Bu proje, KingPower erkeklere özel premium macun için hazırlanmış modern, hızlı ve duyarlı (responsive) bir açılış sayfasıdır (landing page).

## Teknolojiler
- **Next.js 14 (App Router)** - React framework
- **Tailwind CSS** - Stil ve tasarım
- **TypeScript** - Tip güvenliği
- **Lucide React** - İkonlar

## Kurulum ve Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek siteyi görüntüleyin.

## Vercel Üzerinde Yayına Alma (Deploy)

Bu projeyi en kolay şekilde Vercel üzerinden ücretsiz yayınlayabilirsiniz:

1. [Vercel](https://vercel.com) hesabınıza giriş yapın.
2. "Add New Project" butonuna tıklayıp GitHub deponuzu bağlayın.
3. Projenizi seçip "Deploy" butonuna basın. Vercel, Next.js projelerini otomatik tanır ve ayarları yapar.
4. Birkaç dakika içinde siteniz yayında olacaktır!

## Proje Yapısı
- `src/app/page.tsx` - Ana sayfa tasarımı ve içeriği
- `src/app/globals.css` - Global stiller ve Tailwind ayarları
- `tailwind.config.ts` - Tema (renkler, fontlar vb.) yapılandırması
