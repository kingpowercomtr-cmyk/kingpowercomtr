import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PixelInjector from "@/components/PixelInjector";
import { getSiteSetting, SETTING_PIXEL_CODE } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KingPower | Erkeklere Özel Premium Bitkisel Destek",
  description:
    "KingPower ile doğal gücünüzü keşfedin. %100 bitkisel içerikli epimedyumlu macun. Gizli paketleme, ücretsiz kargo, kapıda ödeme.",
  keywords: [
    "KingPower",
    "erkek performans",
    "bitkisel macun",
    "doğal takviye",
    "epimedium",
    "ginseng",
    "maca kökü",
    "gizli kargo",
  ],
  openGraph: {
    title: "KingPower | Erkeklere Özel Premium Bitkisel Destek",
    description:
      "Doğal içerikli premium bitkisel formüller. Hızlı etki, gizli paketleme, ücretsiz kargo.",
    url: "https://kingpower.com.tr",
    siteName: "KingPower",
    locale: "tr_TR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pixelCode = await getSiteSetting(SETTING_PIXEL_CODE);

  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased bg-[#0a0a0a] text-white`}>
        {pixelCode ? <PixelInjector code={pixelCode} /> : null}
        {children}
      </body>
    </html>
  );
}
