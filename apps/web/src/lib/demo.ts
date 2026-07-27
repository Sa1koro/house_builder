import type { PricingJson } from "./utils";

export const DEMO_HOUSE = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "示例 90㎡ 三房（圣都 AEs vs A5s）",
  city: "示例城市",
  sales_area_sqm: 90,
  pricing_area_sqm: 76.34,
  layout: "三房一卫",
  is_public_demo: true,
  owner_id: null,
};

export const DEMO_AES = {
  id: "00000000-0000-4000-8000-000000000010",
  house_id: DEMO_HOUSE.id,
  company: "圣都整装",
  package_name: "AEs",
  version: "2025-宣传页",
  pricing: {
    hardBase: 65000,
    areaOverage: { areaSqm: 26.34, unitPrice: 699, amount: 18411.66 },
    customBoard: { particle: 13000, solidWood: 16000 },
    managementFee: 10009.4,
    projectManagerFee: 1668.23,
    totals: {
      baseParticle: 96411.66,
      baseSolidWood: 99411.66,
      withFeesParticle: 108089.29,
      withFeesSolidWood: 111089.29,
    },
  } satisfies PricingJson,
};

export const DEMO_A5S = {
  id: "00000000-0000-4000-8000-000000000011",
  house_id: DEMO_HOUSE.id,
  company: "圣都整装",
  package_name: "A5s",
  version: "2025-宣传页",
  pricing: {
    hardBase: 75800,
    areaOverage: { areaSqm: 26.34, unitPrice: 799, amount: 21045.66 },
    customBoard: { particle: 13000, solidWood: 16000 },
    managementFee: 11621.48,
    projectManagerFee: 1936.91,
    totals: {
      baseParticle: 109845.66,
      baseSolidWood: 112845.66,
      withFeesParticle: 123404.05,
      withFeesSolidWood: 126404.05,
    },
  } satisfies PricingJson,
};

export const DEMO_LINE_ITEMS_AES = [
  { id: "1", space: "客餐厅", category: "入户/门套", brands: "升升概念/江山欧派/派的门", notes: null, term_slugs: ["door-frame"] },
  { id: "2", space: "客餐厅", category: "强电电线", brands: "中大元通/东方电缆", notes: null, term_slugs: ["strong-electric"] },
  { id: "3", space: "客餐厅", category: "弱电电线", brands: "永鼎", notes: null, term_slugs: ["weak-electric"] },
  { id: "4", space: "阳台", category: "专业防水", brands: "东方雨虹", notes: null, term_slugs: ["waterproof"] },
  { id: "5", space: "卫生间", category: "淋浴房", brands: "宣传页本段未明确单列", notes: "待门店确认", term_slugs: ["shower-enclosure"] },
];

export const DEMO_LINE_ITEMS_A5S = [
  { id: "6", space: "客餐厅", category: "入户/门套", brands: "TATA/升升概念/江山欧派/派的门", notes: "A5s优势：可选TATA", term_slugs: ["door-frame"] },
  { id: "7", space: "客餐厅", category: "强电电线", brands: "飞利浦/中大元通/东方电缆", notes: "A5s优势：可选飞利浦", term_slugs: ["strong-electric"] },
  { id: "8", space: "客餐厅", category: "弱电电线", brands: "飞利浦/永鼎", notes: null, term_slugs: ["weak-electric"] },
  { id: "9", space: "阳台", category: "专业防水", brands: "西卡/东方雨虹", notes: "A5s优势：可选西卡", term_slugs: ["waterproof"] },
  { id: "10", space: "卫生间", category: "淋浴房", brands: "建霖智家/37°C2（约≤3.6㎡）", notes: "A5s优势：明确含淋浴房", term_slugs: ["shower-enclosure"] },
];

export const DEMO_TERMS = [
  { slug: "pricing-area", title: "计价面积", definition: "装修公司用于报价的面积，通常不等于房产证或售卖面积。", category: "报价" },
  { slug: "door-frame", title: "门套", definition: "门框外侧的装饰套线，用于收口墙面与门洞。", category: "硬装" },
  { slug: "strong-electric", title: "强电", definition: "220V 家用动力与照明线路。", category: "水电" },
  { slug: "weak-electric", title: "弱电", definition: "网络、电视、安防等低电压线路。", category: "水电" },
  { slug: "management-fee", title: "工程管理费", definition: "按硬装造价比例收取，圣都宣传页常见 12%。", category: "报价" },
  { slug: "project-manager-fee", title: "项目经理费", definition: "按工程造价比例支付，常见约 2%。", category: "报价" },
  { slug: "custom-board-particle", title: "颗粒板定制", definition: "全屋定制常用基材，套餐标配 15㎡ 内。", category: "定制" },
  { slug: "shower-enclosure", title: "淋浴房", definition: "卫生间干湿分离玻璃隔断。", category: "卫浴" },
  { slug: "waterproof", title: "专业防水", definition: "湿区防水涂刷，品牌如东方雨虹、西卡。", category: "硬装" },
];

export const DEMO_BRANDS = [
  { slug: "tata", name: "TATA木门", categories: ["木门"], tier: "first_tier", summary: "国内一线木门品牌。" },
  { slug: "sika", name: "西卡", categories: ["防水"], tier: "first_tier", summary: "瑞士防水系统品牌。" },
  { slug: "siemens", name: "西门子", categories: ["开关插座"], tier: "first_tier", summary: "德系电工品牌。" },
  { slug: "yuhong", name: "东方雨虹", categories: ["防水"], tier: "first_tier", summary: "国内防水龙头。" },
  { slug: "jomoo", name: "九牧", categories: ["卫浴"], tier: "mainstream", summary: "国产卫浴主流品牌。" },
];

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
