"use client";
import { useEffect } from "react";
import { initTracking } from "@/lib/track";

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initTracking();
  }, []);
  return <>{children}</>;
}
