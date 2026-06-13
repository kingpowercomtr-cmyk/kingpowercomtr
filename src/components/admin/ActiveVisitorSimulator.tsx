"use client";
import { useEffect, useRef, useState } from "react";

export default function ActiveVisitorSimulator() {
  const [display, setDisplay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const targetRef = useRef(0);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const res = await fetch("/api/admin/analytics/active-visitors", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        const next = Math.max(0, Number(data.activeVisitors) || 0);
        targetRef.current = next;
        setLastSync(new Date());
      } finally {
        setLoading(false);
      }
    };

    fetchActive();
    const id = setInterval(fetchActive, 15000);
    return () => clearInterval(id);
  }, []);

  // Hedefe yumuşak geçiş — ani 5↔50 sıçraması yok
  useEffect(() => {
    const id = setInterval(() => {
      setDisplay((prev) => {
        const goal = targetRef.current;
        if (prev < goal) return prev + 1;
        if (prev > goal) return prev - 1;
        return prev;
      });
    }, 280);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#111] border border-purple-500/20 rounded-2xl p-5 hover:border-purple-500/40 transition-colors relative overflow-hidden">
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-green-400 font-bold uppercase">Canlı</span>
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Aktif Ziyaretçi</p>
      <p className="text-3xl font-black text-purple-400 tabular-nums">
        {loading ? "—" : display}
      </p>
      <p className="text-xs text-gray-600 mt-2">
        Son 5 dakikada sitede sinyal gönderen benzersiz oturum
        {lastSync && (
          <span className="block text-gray-700 mt-0.5">
            Güncellendi: {lastSync.toLocaleTimeString("tr-TR")}
          </span>
        )}
      </p>
    </div>
  );
}
