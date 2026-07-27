export type DemoLine = {
  space: string;
  category: string;
  aes: string;
  a5s: string;
  note: string;
  terms: string[];
};

export const demoHouse = {
  id: "demo-90sqm",
  name: "90㎡ 三居装修方案",
  city: "杭州",
  layout: "三室两厅",
  saleArea: 90,
  pricingArea: 76.34,
};

export const proposals = {
  aes: {
    id: "aes",
    name: "AEs",
    company: "圣都整装",
    hardFit: 83413.66,
    customization: 13000,
    management: 10009.64,
    projectManager: 1668.27,
    total: 108091.57,
  },
  a5s: {
    id: "a5s",
    name: "A5s",
    company: "圣都整装",
    hardFit: 96846.66,
    customization: 13000,
    management: 11621.6,
    projectManager: 1936.93,
    total: 123405.19,
  },
};

export const demoLines: DemoLine[] = [
  { space: "客餐厅", category: "地砖+踢脚线", aes: "马可波罗/东鹏/欧神诺/蒙娜丽莎", a5s: "马可波罗/东鹏/欧神诺/蒙娜丽莎", note: "相同", terms: ["踢脚线"] },
  { space: "客餐厅", category: "腻子基层", aes: "东方雨虹", a5s: "东方雨虹", note: "相同", terms: ["腻子"] },
  { space: "客餐厅", category: "乳胶漆", aes: "多乐士/嘉宝莉", a5s: "多乐士/嘉宝莉", note: "相同", terms: ["乳胶漆"] },
  { space: "客餐厅", category: "入户/门套", aes: "升升概念/江山欧派/派的门", a5s: "TATA/升升概念/江山欧派/派的门", note: "A5s 可选 TATA", terms: ["门套"] },
  { space: "客餐厅", category: "窗台石", aes: "天然石/人造石/岩板", a5s: "天然石/人造石/岩板", note: "相同", terms: ["岩板"] },
  { space: "客餐厅", category: "强电电线", aes: "中大元通/东方电缆", a5s: "飞利浦/中大元通/东方电缆", note: "A5s 可选飞利浦", terms: ["强电"] },
  { space: "客餐厅", category: "弱电电线", aes: "永鼎", a5s: "飞利浦/永鼎", note: "A5s 可选飞利浦", terms: ["弱电"] },
  { space: "客餐厅", category: "线管底盒", aes: "伟星/日丰/公元", a5s: "伟星/日丰/公元", note: "相同", terms: ["线管底盒"] },
  { space: "客餐厅", category: "开关插座", aes: "西门子", a5s: "西门子", note: "相同", terms: ["强电"] },
  { space: "客餐厅", category: "全屋定制品牌", aes: "志邦/金牌/莫干山/兔宝宝", a5s: "志邦/金牌/莫干山/兔宝宝", note: "相同", terms: ["全屋定制"] },
  { space: "厨房", category: "地砖墙砖", aes: "马可波罗/东鹏/欧神诺/蒙娜丽莎", a5s: "马可波罗/东鹏/欧神诺/蒙娜丽莎", note: "相同", terms: ["墙砖"] },
  { space: "厨房", category: "集成吊顶+电器", aes: "奥普/美的", a5s: "奥普/美的", note: "相同", terms: ["集成吊顶"] },
  { space: "厨房", category: "橱柜", aes: "金牌（约3m地柜+1.5m吊柜）", a5s: "志邦/金牌/莫干山/兔宝宝", note: "A5s 品牌可选更多", terms: ["地柜", "吊柜"] },
  { space: "厨房", category: "台面", aes: "厨之宝/欧铂利", a5s: "厨之宝/欧铂利", note: "相同", terms: ["台面"] },
  { space: "厨房", category: "水槽+龙头", aes: "欧琳/诺帝玛", a5s: "欧琳/诺帝玛", note: "相同", terms: ["龙头"] },
  { space: "厨房", category: "金属移门", aes: "卡帝/德诺克", a5s: "卡帝/德诺克(梵)", note: "基本相同", terms: ["移门"] },
  { space: "厨房", category: "门套", aes: "升升概念/江山欧派/派的门", a5s: "TATA/升升概念/江山欧派/派的门", note: "A5s 可选 TATA", terms: ["门套"] },
  { space: "卧室", category: "复合地板+踢脚线", aes: "德尔/莫干山/书香门地", a5s: "德尔/莫干山/书香门地/大自然", note: "A5s 多大自然", terms: ["复合地板", "踢脚线"] },
  { space: "卧室", category: "木开门+五金", aes: "升升概念/派的门/江山欧派", a5s: "TATA/升升概念/江山欧派/派的门", note: "A5s 可选 TATA", terms: ["五金"] },
  { space: "卧室", category: "腻子/乳胶漆", aes: "东方雨虹 + 多乐士/嘉宝莉", a5s: "东方雨虹 + 多乐士/嘉宝莉", note: "相同", terms: ["腻子", "乳胶漆"] },
  { space: "阳台", category: "地砖+踢脚线", aes: "马可波罗/东鹏/欧神诺/蒙娜丽莎", a5s: "马可波罗/东鹏/欧神诺/蒙娜丽莎", note: "相同", terms: ["踢脚线"] },
  { space: "阳台", category: "专业防水", aes: "东方雨虹", a5s: "西卡/东方雨虹", note: "A5s 可选西卡", terms: ["防水"] },
  { space: "阳台", category: "地漏", aes: "潜水艇", a5s: "潜水艇", note: "相同", terms: ["地漏"] },
  { space: "卫生间", category: "地砖墙砖", aes: "马可波罗/东鹏/欧神诺/蒙娜丽莎", a5s: "马可波罗/东鹏/欧神诺/蒙娜丽莎", note: "相同", terms: ["墙砖"] },
  { space: "卫生间", category: "专业防水", aes: "东方雨虹", a5s: "西卡/东方雨虹", note: "A5s 可选西卡", terms: ["防水"] },
  { space: "卫生间", category: "集成吊顶+电器", aes: "奥普/美的", a5s: "奥普/美的", note: "相同", terms: ["集成吊顶"] },
  { space: "卫生间", category: "浴室柜/龙头/马桶/花洒", aes: "九牧/箭牌/惠达", a5s: "九牧/箭牌/惠达", note: "相同", terms: ["花洒"] },
  { space: "卫生间", category: "淋浴房", aes: "宣传页本段未明确单列", a5s: "建霖智家/37°C2（约≤3.6㎡）", note: "A5s 明确包含", terms: ["淋浴房"] },
  { space: "卫生间", category: "木门", aes: "升升概念/江山欧派/派的门", a5s: "TATA 等（同卧室门品牌池）", note: "A5s 可选 TATA", terms: ["木门"] },
  { space: "辅材", category: "给水管 PPR", aes: "伟星/日丰/公元", a5s: "伟星/日丰/公元", note: "相同", terms: ["ppr"] },
  { space: "辅材", category: "防水/腻子/石膏", aes: "东方雨虹", a5s: "东方雨虹", note: "相同", terms: ["防水", "腻子"] },
  { space: "其它工程", category: "垃圾袋/成品保护/竣工保洁", aes: "含", a5s: "含", note: "相同", terms: ["成品保护"] },
  { space: "售后", category: "服务承诺", aes: "十诺 / 14815 / 隐蔽约5年", a5s: "同体系服务承诺", note: "基本相同", terms: ["隐蔽工程"] },
];

export const termSummaries: Record<string, string> = {
  计价面积: "装修公司用于套用套餐与超面积计费的面积，可能不同于销售面积。",
  门套: "包覆门洞墙体边缘的保护和装饰构件，注意单双面及材质。",
  踢脚线: "墙地交界处的保护收口材料。",
  腻子: "墙面涂装前用于找平的基层材料。",
  乳胶漆: "常见水性墙面涂料，需核对底漆、面漆遍数与型号。",
  岩板: "经高温烧结的大规格板材，常用于台面与墙面。",
  强电: "承载照明、插座和家电供电的电气系统。",
  弱电: "网络、电视等低电压信号系统。",
  线管底盒: "保护电线及安装开关插座的隐蔽辅材。",
  全屋定制: "按空间尺寸设计、生产和安装柜体的服务组合。",
  防水: "湿区基层的防水涂层及节点处理工程。",
  淋浴房: "卫生间干湿分离隔断，需确认面积、玻璃和五金。",
  ppr: "常见的热熔连接聚丙烯给水管材。",
  隐蔽工程: "完工后被覆盖的水电、防水等工程，应拍照留档。",
};

export const seedBrands = [
  ["TATA 木门", "木门", "一线", "套餐中需核对具体系列、门套与五金是否包含。"],
  ["西卡", "防水辅材", "高端", "建筑化学材料品牌，效果仍取决于具体型号与施工工艺。"],
  ["东方雨虹", "防水辅材", "一线", "常见于防水、腻子等装修辅材清单。"],
  ["马可波罗", "瓷砖", "一线", "需比较套餐内实际可选系列、规格和花色。"],
  ["东鹏", "瓷砖", "一线", "国内瓷砖及卫浴品牌。"],
  ["欧神诺", "瓷砖", "一线", "国内瓷砖品牌。"],
  ["蒙娜丽莎", "瓷砖", "一线", "国内瓷砖品牌。"],
  ["多乐士", "涂料", "一线", "需核对产品系列、环保等级与用量。"],
  ["嘉宝莉", "涂料", "一线", "国内涂料品牌。"],
  ["西门子", "开关插座", "一线", "套餐内通常限定具体系列。"],
  ["伟星", "管材", "一线", "关注管径、壁厚、安装工艺和质保。"],
  ["日丰", "管材", "一线", "国内管材品牌。"],
  ["公元", "管材", "主流", "国内塑料管道品牌。"],
  ["志邦", "定制家居", "一线", "国内定制家居品牌。"],
  ["金牌", "定制家居", "一线", "国内橱柜与定制家居品牌。"],
  ["莫干山", "板材/定制", "一线", "国内板材与定制家居品牌。"],
  ["兔宝宝", "板材/定制", "一线", "国内装饰材料与定制家居品牌。"],
  ["大自然", "地板", "一线", "国内地板品牌。"],
  ["潜水艇", "地漏", "一线", "国内地漏与卫浴五金品牌。"],
  ["九牧", "卫浴", "一线", "国内综合卫浴品牌。"],
] as const;

export const money = (value: number) =>
  new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(value);
