import type { BrandTier, KnowledgeSource, ProposalPricing } from "@house-builder/schema";

export interface HouseRow {
  id: string;
  owner_id: string | null;
  name: string;
  city: string | null;
  layout: string | null;
  sales_area_sqm: number | null;
  billing_area_sqm: number | null;
  is_public_demo: boolean;
  created_at: string;
}

export interface ProposalRow {
  id: string;
  house_id: string;
  company: string;
  package_name: string;
  version: string | null;
  status: "draft" | "confirmed";
  source: string;
  pricing: ProposalPricing;
  total_base: number | null;
  total_with_fees: number | null;
  notes: string[];
  created_at: string;
}

export interface LineItemRow {
  id: string;
  proposal_id: string;
  position: number;
  space: string;
  category: string;
  brand_names: string[];
  spec: string | null;
  note: string | null;
  term_slugs: string[];
}

export type OcrStatus = "pending" | "processing" | "draft_ready" | "reviewed" | "failed";

export interface AssetRow {
  id: string;
  owner_id: string;
  house_id: string;
  proposal_id: string | null;
  blob_url: string;
  pathname: string | null;
  mime: string | null;
  size_bytes: number | null;
  ocr_status: OcrStatus;
  ocr_draft: unknown;
  ocr_error: string | null;
  created_at: string;
}

export interface TermRow {
  id: string;
  slug: string;
  name: string;
  short_def: string;
  aliases: string[];
  source: KnowledgeSource;
  confidence: number;
}

export interface BrandRow {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  categories: string[];
  tier: BrandTier;
  one_liner: string | null;
  country: string | null;
  source: KnowledgeSource;
  confidence: number;
  updated_at: string;
}

export interface WikiPageRow {
  id: string;
  slug: string;
  term_slug: string | null;
  title: string;
  body_md: string;
  status: string;
  source: KnowledgeSource;
  updated_at: string;
}
