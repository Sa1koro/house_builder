export const DEMO_HOUSE_ID = "00000000-0000-4000-8000-000000000001";
export const DEMO_AES_ID = "00000000-0000-4000-8000-000000000010";
export const DEMO_A5S_ID = "00000000-0000-4000-8000-000000000011";

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: 2,
  }).format(n);
}

interface PricingJson {
  hardBase?: number;
  areaOverage?: { areaSqm: number; unitPrice: number; amount: number };
  customBoard?: { particle: number; solidWood: number };
  managementFee?: number;
  projectManagerFee?: number;
  totals?: {
    baseParticle: number;
    baseSolidWood: number;
    withFeesParticle: number;
    withFeesSolidWood: number;
  };
}

export type { PricingJson };
