/** Admin kök: giriş sayfasında sidebar yok; korumalı sayfalar (panel) kendi layout'unu kullanır */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0a0a0a] text-white">{children}</div>;
}
