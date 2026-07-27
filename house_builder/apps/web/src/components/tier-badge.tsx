import { BRAND_TIER_LABELS, type BrandTier } from "@house-builder/schema";
import { clsx } from "clsx";

const tierOrder: BrandTier[] = ["entry", "mainstream", "first_line", "premium"];

export function TierBadge({ tier }: { tier: BrandTier }) {
  const idx = tierOrder.indexOf(tier);
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        idx <= 0 && "bg-[#e8efe6] text-[var(--muted)]",
        idx === 1 && "bg-[#d9e8de] text-[var(--sage-deep)]",
        idx === 2 && "bg-[var(--sage)] text-white",
        idx >= 3 && "bg-[var(--sage-deep)] text-white",
      )}
    >
      {BRAND_TIER_LABELS[tier]}
    </span>
  );
}
