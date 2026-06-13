export type PackageKey = "1" | "2" | "3";

export interface PackageOption {
  key: PackageKey;
  label: string;
  shortLabel: string;
  units: number;
  price: number;
  origPrice: number;
  packageLabel: string;
}

export const PACKAGES: PackageOption[] = [
  {
    key: "1",
    label: "1 Kutu",
    shortLabel: "Tek Kutu",
    units: 1,
    price: 649,
    origPrice: 800,
    packageLabel: "1 Kutu KingPower",
  },
  {
    key: "2",
    label: "2 Kutu",
    shortLabel: "İki Kutu",
    units: 2,
    price: 925,
    origPrice: 1200,
    packageLabel: "2 Kutu KingPower",
  },
  {
    key: "3",
    label: "3 Kutu",
    shortLabel: "Üç Kutu",
    units: 3,
    price: 1300,
    origPrice: 1800,
    packageLabel: "3 Kutu KingPower",
  },
];

export const DEFAULT_PACKAGE_KEY: PackageKey = "1";

/** En avantajlı / en çok tercih edilen paket */
export const POPULAR_PACKAGE_KEY: PackageKey = "2";

export const PACKAGE_MAP: Record<PackageKey, PackageOption> = PACKAGES.reduce(
  (acc, pkg) => {
    acc[pkg.key] = pkg;
    return acc;
  },
  {} as Record<PackageKey, PackageOption>
);

export function getPackage(key: string): PackageOption | undefined {
  return PACKAGE_MAP[key as PackageKey];
}

export function discountPercent(pkg: PackageOption): number {
  return Math.round((1 - pkg.price / pkg.origPrice) * 100);
}

export function formatPrice(amount: number): string {
  return `₺${amount.toLocaleString("tr-TR")}`;
}
