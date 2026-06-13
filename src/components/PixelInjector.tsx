"use client";
import { useEffect } from "react";

/** Admin panelden yapıştırılan Meta/TikTok piksel kodunu head'e enjekte eder */
export default function PixelInjector({ code }: { code: string }) {
  useEffect(() => {
    if (!code?.trim()) return;

    const container = document.createElement("div");
    container.innerHTML = code;

    const added: HTMLElement[] = [];

    container.querySelectorAll("script").forEach((oldScript) => {
      const script = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        script.setAttribute(attr.name, attr.value);
      });
      if (oldScript.textContent) script.textContent = oldScript.textContent;
      document.head.appendChild(script);
      added.push(script);
    });

    container.querySelectorAll("noscript").forEach((oldNs) => {
      const ns = document.createElement("noscript");
      ns.innerHTML = oldNs.innerHTML;
      document.head.appendChild(ns);
      added.push(ns);
    });

    return () => {
      added.forEach((el) => el.remove());
    };
  }, [code]);

  return null;
}
