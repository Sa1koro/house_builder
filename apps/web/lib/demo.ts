export const demoProposals = [
  {
    id: "aes", company: "圣都", name: "AEs", total: 163214, base: 138214, upgrade: 25000,
    items: [
      ["客餐厅", "地面", "马可波罗瓷砖", "800×800"],
      ["卧室", "木门", "TATA 木门", "含门套"],
      ["卫生间", "防水", "西卡防水", "墙地两遍"],
      ["全屋", "电路", "强弱电分离", "按点位"]
    ]
  },
  {
    id: "a5s", company: "圣都", name: "A5s", total: 142560, base: 126560, upgrade: 16000,
    items: [
      ["客餐厅", "地面", "东鹏瓷砖", "800×800"],
      ["卧室", "木门", "TATA 木门", "含门套"],
      ["卫生间", "防水", "西卡防水", "墙地一遍"],
      ["全屋", "电路", "强弱电分离", "基础点位"]
    ]
  }
] as const;

export const demoTerms: Record<string, { title: string; summary: string }> = {
  "门套": { title: "门套", summary: "包覆门洞侧面的饰面结构，影响门洞收口与耐用性。" },
  "强弱电分离": { title: "强弱电分离", summary: "电源线与网线、信号线分开敷设，降低干扰并便于维护。" },
  "西卡": { title: "西卡", summary: "建筑化学材料品牌，装修中常见于防水、密封等材料。" },
  "计价面积": { title: "计价面积", summary: "合同用于计算套餐价格的面积口径，应核对是否含赠送面积。" }
};
