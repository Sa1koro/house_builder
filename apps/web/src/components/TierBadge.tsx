import { BRAND_TIER_LABELS, type BrandTier } from "@house-builder/schema";

const styles: Record<BrandTier, string> = {
  entry: "bg-stone-100 text-stone-600",
  mainstream: "bg-sky-100 text-sky-700",
  premium: "bg-emerald-100 text-emerald-700",
  luxury: "bg-amber-100 text-amber-800",
};

export function TierBadge({ tier }: { tier: BrandTier }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[tier]}`}>
      {BRAND_TIER_LABELS[tier]}
    </span>
  );
}
