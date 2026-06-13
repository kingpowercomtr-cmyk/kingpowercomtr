export const ORDER_STATUSES = [
  { value: "yeni_siparis", label: "Yeni Sipariş" },
  { value: "onaylandi", label: "Onaylandı" },
  { value: "kargolandı", label: "Kargolandı" },
  { value: "iade", label: "İade" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export const ORDER_STATUS_VALUES = ORDER_STATUSES.map((s) => s.value);

export const STATUS_LABELS: Record<string, string> = {
  yeni_siparis: "Yeni Sipariş",
  onaylandi: "Onaylandı",
  kargolandı: "Kargolandı",
  iade: "İade",
  // Eski kayıtlar
  olusturuldu: "Yeni Sipariş",
  kargoda: "Kargolandı",
  "teslim edildi": "Teslim Edildi",
};

export const PENDING_CARGO_STATUSES = ["yeni_siparis", "onaylandi", "olusturuldu"];

export const CARGO_COMPANIES = [
  "",
  "Aras Kargo",
  "MNG Kargo",
  "Yurtiçi Kargo",
  "PTT Kargo",
  "Sürat Kargo",
  "UPS",
  "Diğer",
] as const;
