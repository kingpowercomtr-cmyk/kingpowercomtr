"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navLinks = [
  { href: "/admin", label: "Genel Bakış", icon: "📊" },
  { href: "/admin/siparisler", label: "Siparişler", icon: "📦" },
  { href: "/admin/ziyaretciler", label: "Ziyaretçiler", icon: "👥" },
  { href: "/admin/analiz", label: "Analiz", icon: "📈" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: "⚙️" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" }).catch(() => {});
    document.cookie = "kp_admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    window.location.href = "/admin/giris";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <aside className="w-60 border-r border-white/10 flex flex-col py-6 px-4 gap-2 fixed h-full z-20 bg-[#0a0a0a]">
        <div className="text-xl font-black text-yellow-500 mb-6 px-2">KINGPOWER ADMIN</div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === link.href
                ? "bg-yellow-500/15 text-yellow-400"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
        <div className="mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-colors text-left"
          >
            🚪 Çıkış Yap
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-8 min-h-screen">{children}</main>
    </div>
  );
}
