"use client";
import { useEffect, useState } from "react";

function randomStart(): number {
  return 84 + Math.floor(Math.random() * 8);
}

interface StockUrgencyBarProps {
  className?: string;
}

/** Stok aciliyeti — sayfa açılışında %84–91, her 15 sn +%1 */
export default function StockUrgencyBar({ className = "" }: StockUrgencyBarProps) {
  const [percent, setPercent] = useState(87);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPercent(randomStart());
    setReady(true);
    const id = window.setInterval(() => {
      setPercent((p) => Math.min(p + 1, 98));
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const consumed = Math.round(percent);

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-[11px] sm:text-xs font-bold text-orange-100 leading-snug">
        🔥 Yoğun Talep: Sınırlı Stok! Son Kampanyalı Paketlerin %{consumed}&apos;si Tükendi
      </p>
      <div className="h-2 w-full rounded-full bg-zinc-900/90 overflow-hidden border border-orange-800/40 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 shadow-[0_0_14px_rgba(234,88,12,0.55)] transition-[width] duration-1000 ease-out ${
            ready ? "" : "w-[87%]"
          }`}
          style={{ width: ready ? `${percent}%` : undefined }}
        />
      </div>
    </div>
  );
}
