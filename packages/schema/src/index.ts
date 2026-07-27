export const brandTiers = ["entry", "mainstream", "first_line", "premium"] as const;
export type BrandTier = (typeof brandTiers)[number];

export type ProposalLineItem = {
  room: string;
  category: string;
  item_name: string;
  brand_name?: string;
  specification?: string;
  amount?: number;
  term_slugs: string[];
};

export type ProposalDraft = {
  company: string;
  package_name: string;
  version: string;
  usable_area_sqm: number;
  pricing: Record<string, number>;
  line_items: ProposalLineItem[];
};
