import type { Brand, BrandTier, Term } from "@house-builder/schema";
import { slugify } from "@house-builder/schema";

export interface EnrichConfig {
  provider: "mock" | "search" | "llm";
  apiKey?: string;
  searchUrl?: string;
}

/** Heuristic brand knowledge for cold-start when no external API is configured. */
const BRAND_HINTS: Record<string, Partial<Brand>> = {
  tata: { name: "TATA木门", categories: ["木门", "门套"], tier: "first_tier", summary: "国内一线木门品牌，以静音门、环保门著称。" },
  sika: { name: "西卡", categories: ["防水", "辅材"], tier: "first_tier", summary: "瑞士西卡，建筑化学品与防水系统知名品牌。" },
  philips: { name: "飞利浦", categories: ["电线", "开关"], tier: "first_tier", summary: "飞利浦电工产品线，常见于家装强弱电。" },
  oppein: { name: "欧派", categories: ["橱柜", "全屋定制"], tier: "first_tier", summary: "整体橱柜与全屋定制头部品牌。" },
  jomoo: { name: "九牧", categories: ["卫浴"], tier: "mainstream", summary: "国产卫浴主流品牌，花洒、马桶、浴室柜等。" },
  arrow: { name: "箭牌", categories: ["卫浴"], tier: "mainstream", summary: "卫浴陶瓷主流品牌。" },
  huida: { name: "惠达", categories: ["卫浴"], tier: "mainstream", summary: "卫浴陶瓷老牌企业。" },
  del: { name: "德尔地板", categories: ["地板"], tier: "mainstream", summary: "强化复合地板主流品牌。" },
  nature: { name: "大自然", categories: ["地板"], tier: "first_tier", summary: "实木地板与复合地板一线品牌。" },
  simens: { name: "西门子", categories: ["开关插座"], tier: "first_tier", summary: "德系电工品牌，家装开关插座常见选择。" },
  西门子: { name: "西门子", categories: ["开关插座"], tier: "first_tier", summary: "德系电工品牌，家装开关插座常见选择。" },
  马可波罗: { name: "马可波罗", categories: ["瓷砖"], tier: "first_tier", summary: "瓷砖一线品牌，仿古砖与全瓷砖常见。" },
  东鹏: { name: "东鹏瓷砖", categories: ["瓷砖"], tier: "first_tier", summary: "瓷砖一线品牌。" },
  多乐士: { name: "多乐士", categories: ["乳胶漆"], tier: "first_tier", summary: "阿克苏诺贝尔旗下涂料品牌。" },
  东方雨虹: { name: "东方雨虹", categories: ["防水", "腻子"], tier: "first_tier", summary: "国内建筑防水龙头，家装防水与腻子常见。" },
  伟星: { name: "伟星管业", categories: ["水管", "线管"], tier: "mainstream", summary: "PPR水管与线管主流品牌。" },
  潜水艇: { name: "潜水艇", categories: ["地漏", "五金"], tier: "mainstream", summary: "地漏、角阀等家装五金常见品牌。" },
  奥普: { name: "奥普", categories: ["集成吊顶"], tier: "mainstream", summary: "集成吊顶与浴霸常见品牌。" },
  志邦: { name: "志邦家居", categories: ["橱柜", "全屋定制"], tier: "mainstream", summary: "橱柜与全屋定制主流品牌。" },
  金牌: { name: "金牌橱柜", categories: ["橱柜"], tier: "mainstream", summary: "橱柜主流品牌，套餐中常见约3m地柜配置。" },
};

const TERM_HINTS: Record<string, Partial<Term>> = {
  "pricing-area": {
    title: "计价面积",
    definition: "装修公司用于报价的面积，通常不等于房产证或售卖面积，需按合同约定的折算规则计算。",
    category: "报价",
  },
  "door-frame": {
    title: "门套",
    definition: "门框外侧的装饰套线，用于收口墙面与门洞，材质多为密度板或实木复合。",
    category: "硬装",
  },
  "strong-electric": {
    title: "强电",
    definition: "220V 家用动力与照明线路，含电线、线管、底盒、配电箱等。",
    category: "水电",
  },
  "weak-electric": {
    title: "弱电",
    definition: "网络、电话、有线电视、安防等低电压线路，需与强电分管分槽。",
    category: "水电",
  },
  "management-fee": {
    title: "工程管理费",
    definition: "装修公司按硬装造价比例收取的管理费用，常见为硬装造价的 10%–15%，定制部分可能免收。",
    category: "报价",
  },
  "project-manager-fee": {
    title: "项目经理费",
    definition: "按工程造价比例支付给现场项目经理的费用，常见约 2%，以合同为准。",
    category: "报价",
  },
  "custom-board-particle": {
    title: "颗粒板定制",
    definition: "全屋定制柜体常用基材，性价比高，套餐标配 15㎡ 内常见。",
    category: "定制",
  },
  "custom-board-solid": {
    title: "实木芯定制",
    definition: "柜体采用实木芯材，相对颗粒板环保与质感更好，同套餐内通常加价约 3000 元（15㎡内）。",
    category: "定制",
  },
  "shower-enclosure": {
    title: "淋浴房",
    definition: "卫生间干湿分离的玻璃隔断，套餐是否含淋浴房及面积上限需签约前确认。",
    category: "卫浴",
  },
  "waterproof": {
    title: "专业防水",
    definition: "阳台、卫生间等湿区地面及墙面的防水涂刷，品牌如东方雨虹、西卡等。",
    category: "硬装",
  },
  计价面积: {
    title: "计价面积",
    definition: "装修公司用于报价的面积，通常不等于房产证或售卖面积。",
    category: "报价",
  },
  门套: {
    title: "门套",
    definition: "门框外侧装饰套线，用于收口门洞与墙面。",
    category: "硬装",
  },
  强电: {
    title: "强电",
    definition: "220V 家用动力与照明线路系统。",
    category: "水电",
  },
  弱电: {
    title: "弱电",
    definition: "网络、电视、安防等低电压线路。",
    category: "水电",
  },
};

function normalizeKey(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, "");
}

export async function enrichBrand(
  query: string,
  config: EnrichConfig
): Promise<Brand> {
  const key = normalizeKey(query);
  const hint = BRAND_HINTS[key] ?? BRAND_HINTS[slugify(query)];

  if (config.provider === "llm" && config.apiKey) {
    // Placeholder for real LLM integration
    return buildBrandFromHint(query, hint);
  }

  if (config.provider === "search" && config.searchUrl && config.apiKey) {
    // Placeholder for external search API
    return buildBrandFromHint(query, hint);
  }

  return buildBrandFromHint(query, hint);
}

export async function enrichTerm(
  query: string,
  _config: EnrichConfig
): Promise<Term> {
  const key = normalizeKey(query);
  const hint =
    TERM_HINTS[key] ??
    TERM_HINTS[slugify(query)] ??
  Object.values(TERM_HINTS).find(
    (t) => t.title && normalizeKey(t.title) === key
  );

  const slug = slugify(query);
  return {
    slug,
    title: hint?.title ?? query,
    definition:
      hint?.definition ??
      `「${query}」的释义待补充，建议签约前向装修公司或监理确认具体含义。`,
    category: hint?.category ?? "装修名词",
    aliases: hint?.aliases,
    source: "enrich",
    confidence: hint ? 0.85 : 0.5,
  };
}

function buildBrandFromHint(
  query: string,
  hint?: Partial<Brand>
): Brand {
  const name = hint?.name ?? query;
  const slug = slugify(name);
  return {
    name,
    slug,
    categories: hint?.categories ?? ["未分类"],
    tier: (hint?.tier as BrandTier) ?? "mainstream",
    aliases: hint?.aliases ?? (name !== query ? [query] : []),
    summary:
      hint?.summary ??
      `「${name}」为家装常见品牌，具体档次与品类以门店选材为准。`,
    source: "enrich",
    confidence: hint ? 0.85 : 0.55,
  };
}

export { BRAND_HINTS, TERM_HINTS };
