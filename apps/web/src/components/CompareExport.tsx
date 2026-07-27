"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface CompareExportProps {
  house: { name: string; pricing_area_sqm: number };
  propA: { package_name: string; company: string };
  propB: { package_name: string; company: string };
  pricingA: { totals?: { withFeesParticle?: number; baseParticle?: number } };
  pricingB: { totals?: { withFeesParticle?: number; baseParticle?: number } };
  diffParticle: number;
}

export function CompareExport({
  house,
  propA,
  propB,
  pricingA,
  pricingB,
  diffParticle,
}: CompareExportProps) {
  const [copied, setCopied] = useState(false);

  const markdown = `# ${house.name} — ${propA.package_name} vs ${propB.package_name}

计价面积：${house.pricing_area_sqm}㎡
公司：${propA.company}

## 总价（颗粒板含费）
| 套餐 | 含费预估 | 基础价 |
|------|----------|--------|
| ${propA.package_name} | ${formatCurrency(pricingA.totals?.withFeesParticle ?? 0)} | ${formatCurrency(pricingA.totals?.baseParticle ?? 0)} |
| ${propB.package_name} | ${formatCurrency(pricingB.totals?.withFeesParticle ?? 0)} | ${formatCurrency(pricingB.totals?.baseParticle ?? 0)} |
| 差额 | +${formatCurrency(diffParticle)} | |

请帮我分析这两个装修套餐的性价比与签约注意事项。`;

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="card">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">复制给 AI</h2>
        <button onClick={copy} className="btn btn-secondary text-sm">
          {copied ? "已复制" : "复制 Markdown"}
        </button>
      </div>
      <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
        {markdown}
      </pre>
    </section>
  );
}
