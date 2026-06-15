"use client";
import { useState, useEffect } from "react";
import { trackFormStart, trackFormSubmit, trackFormError, trackClick } from "@/lib/track";
import { PACKAGES, DEFAULT_PACKAGE_KEY, POPULAR_PACKAGE_KEY, formatPrice } from "@/lib/packages";
import FreeShippingBadge from "@/components/FreeShippingBadge";
import StockUrgencyBar from "@/components/StockUrgencyBar";
import OrderTrustBadges from "@/components/OrderTrustBadges";
import { TURKEY_CITIES, getDistrictsForCity } from "@/lib/turkey-locations";
import { sanitizePhoneInput, isValidTurkishMobile } from "@/lib/order-utils";

interface OrderFormProps {
  initialPackage?: string;
  onSuccess: (code: string) => void;
}

export default function OrderForm({ initialPackage = DEFAULT_PACKAGE_KEY, onSuccess }: OrderFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    paymentType: "nakit",
    packageType: initialPackage,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [badgeText, setBadgeText] = useState("🔥 EN AVANTAJLI / EN ÇOK TERCİH EDİLEN");

  useEffect(() => {
    fetch("/api/settings/public", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.packageBadgeText) setBadgeText(d.packageBadgeText);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, packageType: initialPackage }));
  }, [initialPackage]);

  const districtOptions = getDistrictsForCity(formData.city);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!started) {
      setStarted(true);
      trackFormStart();
    }
    if (name === "phone") {
      setFormData((prev) => ({ ...prev, phone: sanitizePhoneInput(value) }));
    } else if (name === "city") {
      setFormData((prev) => ({ ...prev, city: value, district: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
    }
    if (name === "city" && errors.district) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n.district;
        return n;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Ad soyad zorunludur.";
    if (!isValidTurkishMobile(formData.phone)) {
      newErrors.phone = "10 haneli cep numarası girin (5 ile başlar). Örn: 5468823229";
    }
    if (!formData.city) newErrors.city = "Şehir seçiniz.";
    if (!formData.district.trim()) newErrors.district = "İlçe zorunludur.";
    if (!formData.address.trim()) newErrors.address = "Adres zorunludur.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.entries(newErrors).forEach(([field, msg]) => trackFormError(field, msg));
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409 && data.duplicate) {
          // Mükerrer sipariş - daha önce alınmış, başarı ekranını göster
          trackFormError("form", "duplicate_order");
          if (data.code) {
            onSuccess(data.code);
          } else {
            setErrors({ form: data.error || "Siparişiniz zaten alındı." });
          }
        } else {
          setErrors({ form: data.error || "Sipariş gönderilemedi." });
          trackFormError("form", data.error || "submit_failed");
        }
      } else {
        trackFormSubmit(formData.packageType);
        onSuccess(data.code);
        setFormData({
          fullName: "",
          phone: "",
          city: "",
          district: "",
          address: "",
          paymentType: "nakit",
          packageType: formData.packageType,
        });
        setStarted(false);
      }
    } catch {
      setErrors({ form: "Bağlantı hatası. Tekrar deneyin." });
      trackFormError("form", "network_error");
    } finally {
      setLoading(false);
    }
  };

  const selectedPkg = PACKAGES.find((p) => p.key === formData.packageType);

  return (
    <section
      id="siparis"
      className="py-24 px-4 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,rgba(10,10,10,1)_70%)]"
      data-section="siparis"
    >
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-400 uppercase tracking-widest mb-4">
            SİPARİŞ
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-2">Siparişinizi Oluşturun</h2>
          <p className="text-gray-400">Gizli paketleme ile aynı gün ücretsiz kargo.</p>
        </div>

        <div className="bg-[#111] border border-yellow-500/20 rounded-3xl p-7 shadow-2xl">
          <h3 className="text-xl font-bold text-center mb-1">Teslimat Bilgilerini Girin</h3>
          {selectedPkg && (
            <div className="text-center mb-4">
              <p className="text-sm text-yellow-400 font-medium">
                Seçili paket: <span className="font-bold">{selectedPkg.packageLabel}</span>
              </p>
              <p className="text-lg font-black text-white mt-1">
                <span className="text-gray-500 line-through text-sm mr-2">
                  {formatPrice(selectedPkg.origPrice)}
                </span>
                {formatPrice(selectedPkg.price)}
              </p>
              <FreeShippingBadge className="mt-3" />
            </div>
          )}

          {errors.form && (
            <div className="bg-red-900/30 border border-red-700/40 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Adınız Soyadınız" error={errors.fullName}>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ahmet Yılmaz"
                className={inputCls(!!errors.fullName)}
              />
            </Field>

            <Field label="Cep Telefonunuz" error={errors.phone}>
              <div className="flex gap-2">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-3 py-3 text-gray-400 text-sm font-mono flex-shrink-0">
                  +90
                </div>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="5468823229"
                  maxLength={10}
                  pattern="5[0-9]{9}"
                  className={inputCls(!!errors.phone) + " flex-1 font-mono tracking-wide"}
                />
              </div>
            </Field>

            <Field label="Şehir" error={errors.city}>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputCls(!!errors.city) + " appearance-none cursor-pointer"}
              >
                <option value="">Şehir seçiniz...</option>
                {TURKEY_CITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#1a1a1a]">
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="İlçe" error={errors.district}>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.city}
                className={
                  inputCls(!!errors.district) +
                  " appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                }
              >
                <option value="">
                  {formData.city ? "İlçe seçiniz..." : "Önce şehir seçin"}
                </option>
                {districtOptions.map((d) => (
                  <option key={d} value={d} className="bg-[#1a1a1a]">
                    {d}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Detaylı Adres" error={errors.address}>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Mahalle, sokak, kapı no..."
                className={inputCls(!!errors.address) + " resize-none"}
              />
            </Field>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Ödeme Şekli</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "nakit", label: "💵 Kapıda Nakit" },
                  { value: "kart", label: "💳 Kapıda Kart" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, paymentType: opt.value }));
                      trackClick("payment_select", { type: opt.value });
                    }}
                    className={`py-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                      formData.paymentType === opt.value
                        ? "border-yellow-500 bg-yellow-500/15 text-yellow-400"
                        : "border-gray-800 bg-[#1a1a1a] text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Seçtiğiniz Paket</label>
              <div className="space-y-2">
                {PACKAGES.map((pkg) => {
                  const isPopular = pkg.key === POPULAR_PACKAGE_KEY;
                  const selected = formData.packageType === pkg.key;
                  return (
                    <button
                      key={pkg.key}
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({ ...p, packageType: pkg.key }));
                        trackClick("form_package_select", { pkg: pkg.key });
                      }}
                      className={`relative z-10 w-full text-left px-4 py-3.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                        selected
                          ? "border-yellow-500 bg-yellow-500/15 text-yellow-400"
                          : "border-gray-800 bg-[#1a1a1a] text-gray-300 hover:border-gray-600 hover:text-white"
                      } ${isPopular && !selected ? "popular-package-pulse border-orange-500/50" : ""}`}
                    >
                      {isPopular && (
                        <span className="block text-[10px] font-black uppercase tracking-wide text-orange-400 mb-1.5">
                          {badgeText}
                        </span>
                      )}
                      <span>
                        {pkg.label} —{" "}
                        <span className="line-through text-gray-500 mr-1">{formatPrice(pkg.origPrice)}</span>
                        {formatPrice(pkg.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
              <FreeShippingBadge className="mt-4" />
            </div>

            <StockUrgencyBar className="mt-4 mb-1" />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg font-black text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl transition-all transform hover:scale-[1.02] shadow-xl shadow-red-700/30 disabled:opacity-60 disabled:scale-100"
            >
              {loading ? "Sipariş oluşturuluyor..." : "🛒 Siparişimi Tamamla"}
            </button>

            <OrderTrustBadges />

            <p className="text-center text-xs text-gray-600">
              Sipariş vererek{" "}
              <a href="/gizlilik-politikasi" className="underline hover:text-gray-400">
                gizlilik politikasını
              </a>{" "}
              ve{" "}
              <a href="/kullanim-kosullari" className="underline hover:text-gray-400">
                kullanım koşullarını
              </a>{" "}
              kabul etmiş olursunuz.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function inputCls(hasError: boolean) {
  return `w-full bg-[#1a1a1a] border ${hasError ? "border-red-600" : "border-gray-800"} rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors text-white text-sm`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
