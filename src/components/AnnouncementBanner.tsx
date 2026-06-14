"use client";
import { useEffect, useState } from "react";

export default function AnnouncementBanner() {
  const [text, setText] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/settings/public", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setText(d.announcementText || "");
          setEnabled(!!d.announcementEnabled);
        }
      })
      .catch(() => {});
  }, []);

  if (!enabled || !text.trim()) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-black text-sm sm:text-base font-bold text-center py-2.5 px-4 relative z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-2">
        <span>{text}</span>
      </div>
    </div>
  );
}
