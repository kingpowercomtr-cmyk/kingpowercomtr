"use client";
import { useEffect, useRef, useState } from "react";

const BADGES = [
  { icon: "🔒", text: "256-Bit SSL Güvenli Altyapı" },
  { icon: "📦", text: "Gizli Paketleme (İçeriği Dışarıdan Belli Olmaz)" },
  { icon: "🤝", text: "%100 Orijinal Ürün Garantisi" },
];

export default function OrderTrustBadges() {
  const [display, setDisplay] = useState(0);
  const targetRef = useRef(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats/active", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const next = Math.max(0, Number(data.formFillers) || 0);
        targetRef.current = next;
      } catch {
        // sessiz
      }
    };

    fetchStats();
    const id = setInterval(fetchStats, 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setDisplay((prev) => {
        const goal = targetRef.current;
        if (prev < goal) return prev + 1;
        if (prev > goal) return prev - 1;
        return prev;
      });
    }, 320);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3 pt-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {BADGES.map((b) => (
          <div
            key={b.text}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-center sm:text-left justify-center sm:justify-start"
          >
            <span className="text-base flex-shrink-0">{b.icon}</span>
            <span className="text-[11px] sm:text-xs text-zinc-300 font-medium leading-tight">{b.text}</span>
          </div>
        ))}
      </div>
      {display > 0 && (
        <p className="text-center text-xs text-amber-400/90 font-semibold leading-relaxed px-1">
          ⏱️ Dikkat: Formu şu an sizinle birlikte{" "}
          <span className="text-amber-300 font-black tabular-nums">{display} kişi</span> daha
          dolduruyor. Erken bitiren sipariş önceliği kazanır!
        </p>
      )}
    </div>
  );
}
