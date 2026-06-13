export default function FreeShippingBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <span className="free-shipping-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-white">
        <span className="text-base animate-pulse">🔥</span>
        ÜCRETSİZ KARGO
        <span className="text-base animate-pulse">🔥</span>
      </span>
    </div>
  );
}
