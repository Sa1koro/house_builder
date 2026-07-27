export type BrandTier = "入门" | "主流" | "一线" | "高端";

export interface ProposalCosts {
  hardFit: number;
  customization: number;
  management: number;
  projectManager: number;
  total: number;
}

export interface ProposalLineItem {
  space: string;
  category: string;
  specification: string;
  brands: string[];
  termSlugs?: string[];
  notes?: string;
}

export interface ProposalDraft {
  company: string;
  packageName: string;
  version: string;
  currency: "CNY";
  pricingArea?: number;
  costs: ProposalCosts;
  lineItems: ProposalLineItem[];
  sourceAssetUrl?: string;
  ocrConfidence?: number;
}
