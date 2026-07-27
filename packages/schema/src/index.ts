export type BrandTier = "entry" | "mainstream" | "first_tier" | "premium";

export const BRAND_TIER_LABELS: Record<BrandTier, string> = {
  entry: "入门",
  mainstream: "主流",
  first_tier: "一线",
  premium: "高端",
};

export interface ProposalPricing {
  hardBase: number;
  areaOverage?: {
    areaSqm: number;
    unitPrice: number;
    amount: number;
  };
  customBoard?: {
    particle: number;
    solidWood: number;
  };
  managementFee?: number;
  projectManagerFee?: number;
  totals: {
    baseParticle: number;
    baseSolidWood: number;
    withFeesParticle: number;
    withFeesSolidWood: number;
  };
}

export interface ProposalLineItem {
  space: string;
  category: string;
  brands: string;
  spec?: string;
  termSlugs?: string[];
  notes?: string;
}

export interface Proposal {
  company: string;
  packageName: string;
  version?: string;
  pricing: ProposalPricing;
  lineItems: ProposalLineItem[];
  notes?: string[];
}

export interface Brand {
  name: string;
  slug: string;
  categories: string[];
  tier: BrandTier;
  aliases?: string[];
  summary?: string;
  source?: "seed" | "enrich" | "editor";
  confidence?: number;
}

export interface Term {
  slug: string;
  title: string;
  definition: string;
  category?: string;
  aliases?: string[];
  source?: "seed" | "enrich" | "editor";
  confidence?: number;
}

export interface WikiPage {
  slug: string;
  title: string;
  content: string;
  termSlug?: string;
  brandSlug?: string;
}

export interface DraftProposal extends Proposal {
  _draft?: {
    sourceAssetId?: string;
    ocrConfidence?: number;
    reviewed?: boolean;
  };
}

export function calcQuote(area: number): {
  aesHard: number;
  a5sHard: number;
  customP: number;
  customS: number;
} {
  if (area < 50 || area >= 80) {
    throw new Error(`Formula covers 50 ≤ area < 80, got ${area}`);
  }
  const aesHard = 65000 + (area - 50) * 699;
  const a5sHard = 75800 + (area - 50) * 799;
  return { aesHard, a5sHard, customP: 13000, customS: 16000 };
}

export function calcTotals(hard: number, custom: number) {
  const mgmt = hard * 0.12;
  const pm = hard * 0.02;
  return {
    base: hard + custom,
    withFees: hard + custom + mgmt + pm,
    managementFee: mgmt,
    projectManagerFee: pm,
  };
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
