"use client";
import { useEffect } from "react";
import { whatsappUrl } from "@/lib/constants";

interface SuccessModalProps {
  orderCode: string;
  onClose: () => void;
}

export default function SuccessModal({ orderCode, onClose }: SuccessModalProps) {
  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 bg-[#0f1218] border border-green-500/30 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl shadow-green-500/10 animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Check icon with pulse */}
        <div className="relative inline-flex mb-6">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
          <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Confetti emoji */}
        <div className="text-3xl mb-3 select-none">🎉 🎊 🥳</div>

        <h2 className="text-2xl font-black text-white mb-2">Siparişiniz Alındı!</h2>
        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
          Siparişiniz başarıyla oluşturuldu. En kısa sürede kargoya verilecektir.
        </p>

        {/* Order code */}
        <div className="bg-black/50 border border-white/10 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Sipariş Takip Kodunuz</p>
          <p className="text-2xl font-black font-mono text-yellow-400 tracking-wider">{orderCode}</p>
          <p className="text-xs text-gray-600 mt-1">Bu kodu saklayın — sipariş durumunuzu sorgulamak için kullanabilirsiniz.</p>
        </div>

        {/* Info pills */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
          <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-3 text-green-300">
            <div className="text-lg mb-1">📦</div>
            Gizli paketleme ile kargoya verilecek
          </div>
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3 text-blue-300">
            <div className="text-lg mb-1">💳</div>
            Kapıda nakit veya kart ile ödeme
          </div>
        </div>

        {/* Close / WhatsApp buttons */}
        <div className="space-y-3">
          <a
            href={whatsappUrl(`Merhaba, ${orderCode} numaralı siparişimi takip etmek istiyorum.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-500 transition-colors rounded-xl font-bold text-white text-sm"
          >
            💬 WhatsApp&apos;tan Takip Et
          </a>
          <button
            onClick={onClose}
            className="w-full py-3 border border-white/10 hover:bg-white/5 transition-colors rounded-xl text-gray-400 text-sm"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
