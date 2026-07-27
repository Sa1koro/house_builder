import { Ajv2020 as Ajv, type ValidateFunction, type ErrorObject } from "ajv/dist/2020";
import proposalSchema from "../schemas/proposal.schema.json" with { type: "json" };
import brandSchema from "../schemas/brand.schema.json" with { type: "json" };
import termSchema from "../schemas/term.schema.json" with { type: "json" };

export { proposalSchema, brandSchema, termSchema };

// ---------- TypeScript 类型（与 JSON Schema 保持同步） ----------

export type BrandTier = "entry" | "mainstream" | "premium" | "luxury";
export type KnowledgeSource = "seed" | "enrich" | "editor";

export const BRAND_TIER_LABELS: Record<BrandTier, string> = {
  entry: "入门",
  mainstream: "主流",
  premium: "一线",
  luxury: "高端",
};

export const BRAND_TIER_ORDER: BrandTier[] = ["entry", "mainstream", "premium", "luxury"];

export interface PricingItem {
  key: string;
  label: string;
  amount: number;
  note?: string;
}

export interface ProposalPricing {
  currency: string;
  items: PricingItem[];
  total_base?: number;
  total_with_fees?: number;
}

export interface ProposalLineItem {
  space: string;
  category: string;
  brands?: string[];
  spec?: string;
  term_slugs?: string[];
  note?: string;
}

export interface Proposal {
  company: string;
  package_name: string;
  version?: string;
  billing_area_sqm?: number;
  pricing: ProposalPricing;
  line_items: ProposalLineItem[];
  notes?: string[];
}

export interface Brand {
  slug: string;
  name: string;
  aliases?: string[];
  categories?: string[];
  tier: BrandTier;
  one_liner?: string;
  country?: string;
  source?: KnowledgeSource;
  confidence?: number;
}

export interface Term {
  slug: string;
  name: string;
  short_def: string;
  aliases?: string[];
  wiki_md?: string;
  source?: KnowledgeSource;
  confidence?: number;
}

// ---------- 校验器（Web 校对页 / ingest API / enrich 共用） ----------

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

const proposalValidator: ValidateFunction<Proposal> = ajv.compile<Proposal>(proposalSchema);
const brandValidator: ValidateFunction<Brand> = ajv.compile<Brand>(brandSchema);
const termValidator: ValidateFunction<Term> = ajv.compile<Term>(termSchema);

export interface ValidationResult<T> {
  ok: boolean;
  data?: T;
  errors?: string[];
}

function formatErrors(errors: ErrorObject[] | null | undefined): string[] {
  return (errors ?? []).map((e) => `${e.instancePath || "/"} ${e.message ?? ""}`.trim());
}

export function validateProposal(input: unknown): ValidationResult<Proposal> {
  if (proposalValidator(input)) return { ok: true, data: input };
  return { ok: false, errors: formatErrors(proposalValidator.errors) };
}

export function validateBrand(input: unknown): ValidationResult<Brand> {
  if (brandValidator(input)) return { ok: true, data: input };
  return { ok: false, errors: formatErrors(brandValidator.errors) };
}

export function validateTerm(input: unknown): ValidationResult<Term> {
  if (termValidator(input)) return { ok: true, data: input };
  return { ok: false, errors: formatErrors(termValidator.errors) };
}

// ---------- 工具 ----------

/** 将任意名字转成 slug（中文走 pinyin 不可靠，这里保守地转小写、去空格；中文名建议显式给 slug）。 */
export function toSlug(input: string): string {
  const ascii = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (/^[a-z0-9-]+$/.test(ascii) && ascii.length > 0) return ascii;
  // 含中文时退化为十六进制编码，保证稳定且符合 slug 约束
  const hex = Array.from(new TextEncoder().encode(input.trim()))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `zh-${hex.slice(0, 40)}`;
}
