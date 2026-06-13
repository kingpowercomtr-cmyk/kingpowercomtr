"use client";
import { useCallback, useEffect, useState } from "react";

const NAMES = [
  "Mehmet U.",
  "Ahmet K.",
  "Mustafa T.",
  "İbrahim Y.",
  "Hüseyin Ç.",
  "Murat B.",
  "Ali Ö.",
  "Ömer S.",
];

const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Konya",
  "Adana",
  "Gaziantep",
  "Samsun",
  "Şanlıurfa",
];

const TIMES = ["2 dakika önce", "5 dakika önce", "12 dakika önce", "az önce"];

const PACKAGES = [
  "Tek Kutu KingPower",
  "2'li Paket KingPower (En Çok Tercih Edilen)",
  "3'lü Paket KingPower (Avantajlı)",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildMessage(): string {
  const name = pick(NAMES);
  const city = pick(CITIES);
  const time = pick(TIMES);
  const pkg = pick(PACKAGES);
  return `${name} (${city}), ${time} ${pkg} siparişi verdi! 🛒`;
}

export default function LiveOrderToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showToast = useCallback(() => {
    setMessage(buildMessage());
    setVisible(true);
    window.setTimeout(() => setVisible(false), 4000);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNext = () => {
      const wait = 8000 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        showToast();
        scheduleNext();
      }, wait);
    };

    const first = setTimeout(() => {
      showToast();
      scheduleNext();
    }, 3500);

    return () => {
      clearTimeout(first);
      clearTimeout(timeoutId);
    };
  }, [showToast]);

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 max-w-sm pointer-events-none transition-all duration-500 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
      aria-live="polite"
    >
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-md shadow-2xl shadow-black/50">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-lg">
          📦
        </div>
        <p className="text-sm text-zinc-200 leading-snug font-medium">{message}</p>
      </div>
    </div>
  );
}
