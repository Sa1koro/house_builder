import { z } from "zod";

export const BrandTierSchema = z.enum([
  "entry",
  "mainstream",
  "first_line",
  "premium",
]);
export type BrandTier = z.infer<typeof BrandTierSchema>;

export const BRAND_TIER_LABELS: Record<BrandTier, string> = {
  entry: "入门",
  mainstream: "主流",
  first_line: "一线",
  premium: "高端",
};

export const SourceSchema = z.enum(["seed", "enrich", "editor"]);
export type KnowledgeSource = z.infer<typeof SourceSchema>;

export const ProposalCostsSchema = z
  .object({
    hard_base: z.number(),
    overage_unit: z.number().optional(),
    overage_area: z.number().optional(),
    overage_fee: z.number().optional(),
    hard_subtotal: z.number(),
    custom_particle: z.number(),
    custom_solid: z.number().optional(),
    base_particle: z.number(),
    base_solid: z.number().optional(),
    mgmt_fee: z.number().optional(),
    pm_fee: z.number().optional(),
    total_particle: z.number().optional(),
    total_solid: z.number().optional(),
    currency: z.string().default("CNY"),
  })
  .passthrough();

export const LineItemSchema = z.object({
  space: z.string(),
  category: z.string(),
  spec: z.string(),
  brands: z.array(z.string()).optional(),
  term_slugs: z.array(z.string()).optional(),
  qty: z.number().optional(),
  unit: z.string().optional(),
  amount: z.number().optional(),
  notes: z.string().optional(),
});

export const ProposalSchema = z.object({
  id: z.string().uuid().optional(),
  house_id: z.string().uuid().optional(),
  company: z.string().min(1),
  package_name: z.string().min(1),
  version: z.string().default("1.0"),
  billing_area_sqm: z.number().nonnegative().optional(),
  sales_area_sqm: z.number().nonnegative().optional(),
  costs: ProposalCostsSchema,
  line_items: z.array(LineItemSchema),
  notes: z.array(z.string()).optional(),
  source: z.enum(["seed", "manual", "ocr_review", "import"]).optional(),
});

export type Proposal = z.infer<typeof ProposalSchema>;
export type LineItem = z.infer<typeof LineItemSchema>;
export type ProposalCosts = z.infer<typeof ProposalCostsSchema>;

export const BrandSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  categories: z.array(z.string()).min(1),
  tier: BrandTierSchema,
  summary: z.string().optional(),
  source: SourceSchema.default("seed"),
  confidence: z.number().min(0).max(1).optional(),
});
export type Brand = z.infer<typeof BrandSchema>;

export const TermSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  summary: z.string().min(1),
  category: z.string().optional(),
  source: SourceSchema.default("seed"),
  confidence: z.number().min(0).max(1).optional(),
  wiki_slug: z.string().optional(),
});
export type Term = z.infer<typeof TermSchema>;

export const WikiPageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  body_md: z.string(),
  term_slug: z.string().optional(),
  brand_slug: z.string().optional(),
  source: SourceSchema.default("seed"),
});
export type WikiPage = z.infer<typeof WikiPageSchema>;

export function slugify(input: string): string {
  const map: Record<string, string> = {
    西卡: "sika",
    飞利浦: "philips",
    大自然: "daziran",
    计价面积: "billing-area",
    售卖面积: "sales-area",
    门套: "door-casing",
    强电: "power-wiring",
    弱电: "weak-current",
    工程管理费: "mgmt-fee",
    项目经理费: "pm-fee",
    颗粒板: "particle-board",
    实木芯: "solid-core",
    淋浴房: "shower-enclosure",
    全屋定制: "custom-cabinetry",
    硬装: "hard-fitout",
    隐蔽工程: "concealed-works",
    科勒: "kohler",
    潜水艇: "submarine",
    嘉宝莉: "carpoly",
    蒙娜丽莎: "monalisa",
    欧神诺: "oceano",
    东鹏: "dongpeng",
    莫干山: "moganshan",
    兔宝宝: "tubao",
    书香门地: "sxmd",
    厨之宝: "chuzhibao",
    欧铂利: "opl",
    欧琳: "olin",
    诺帝玛: "nuodima",
    卡帝: "kadi",
    德诺克: "denuoke",
    建霖智家: "jianlin",
    中大元通: "zdyt",
    东方电缆: "dfdl",
    永鼎: "yongding",
    公元: "gongyuan",
    德力西: "delixi",
    东方雨虹: "dongfang-yuhong",
    多乐士: "dulux",
    马可波罗: "marcopolo",
    志邦: "zhibang",
    金牌: "goldmedal",
    德尔: "der",
    九牧: "jiumu",
    箭牌: "arrow",
    惠达: "huida",
    西门子: "siemens",
    伟星: "weixing",
    日丰: "rifeng",
    升升概念: "shengsheng",
    江山欧派: "oppein-door",
    派的门: "paidemen",
    奥普: "aupu",
    美的: "midea",
  };
  const trimmed = input.trim();
  if (map[trimmed]) return map[trimmed];
  const lower = trimmed.toLowerCase();
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lower)) return lower;

  // Prefer latin transliteration when present (e.g. "Kohler 科勒")
  const latin = trimmed.match(/[A-Za-z][A-Za-z0-9-]*/g);
  if (latin?.length) {
    return latin.join("-").toLowerCase().slice(0, 64);
  }

  // Stable slug for CJK / other scripts
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash * 31 + trimmed.charCodeAt(i)) >>> 0;
  }
  return `item-${hash.toString(36)}`.slice(0, 64);
}
