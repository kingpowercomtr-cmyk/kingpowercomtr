/** WhatsApp: 0531 495 5170 */
export const WHATSAPP_NUMBER = "905314955170";
export const WHATSAPP_DISPLAY = "0531 495 5170";

/** Sipariş başına sabit net kâr (TL) */
export const PROFIT_PER_ORDER = 149;

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
