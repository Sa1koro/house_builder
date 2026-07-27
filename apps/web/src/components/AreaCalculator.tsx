"use client";

import { useState } from "react";

function quote(area: number) {
  // 圣都宣传页档位公式（AEs 覆盖至 110㎡；A5s 覆盖全档）
  const aesHard =
    area >= 50 && area < 80
      ? 65000 + (area - 50) * 699
      : area >= 80 && area < 110
        ? 85000 + (area - 80) * 699
        : null;
  const a5sHard =
    area >= 50 && area < 80
      ? 75800 + (area - 50) * 799
      : area >= 80 && area < 110
        ? 97500 + (area - 80) * 799
        : area >= 110 && area < 140
          ? 134500 + (area - 110) * 799
          : area >= 140
            ? area * 1208
            : null;
  const withFees = (hard: number | null) => (hard === null ? null : hard + 13000 + hard * 0.12 + hard * 0.02);
  return {
    aesHard,
    a5sHard,
    aesTotal: withFees(aesHard),
    a5sTotal: withFees(a5sHard),
  };
}

const fmt = (v: number | null) =>
  v === null ? "档位外" : `¥${v.toLocaleString("zh-CN", { maximumFractionDigits: 0 })}`;

/** 计价面积计算器：售卖面积 × (1-公摊) 粗估 + 圣都套餐档位测算 */
export function AreaCalculator() {
  const [salesArea, setSalesArea] = useState(90);
  const [shareRatio, setShareRatio] = useState(18);
  const [billingArea, setBillingArea] = useState<number | "">(76.34);

  const estimated = Math.round(salesArea * (1 - shareRatio / 100) * 100) / 100;
  const area = billingArea === "" ? estimated : billingArea;
  const q = quote(Number(area));

  const input =
    "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-stone-700">售卖面积（建筑面积 ㎡）</span>
          <input
            type="number"
            value={salesArea}
            min={0}
            onChange={(e) => setSalesArea(Number(e.target.value))}
            className={input}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-stone-700">公摊比例（%）</span>
          <input
            type="number"
            value={shareRatio}
            min={0}
            max={40}
            onChange={(e) => setShareRatio(Number(e.target.value))}
            className={input}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-stone-700">计价面积（有实测填这里）</span>
          <input
            type="number"
            value={billingArea}
            placeholder={`粗估 ${estimated}`}
            onChange={(e) => setBillingArea(e.target.value === "" ? "" : Number(e.target.value))}
            className={input}
          />
        </label>
      </div>

      <p className="text-sm text-stone-500">
        按公摊粗估计价面积 ≈ <span className="font-semibold text-stone-900">{estimated}㎡</span>
        ；测算使用 <span className="font-semibold text-stone-900">{area}㎡</span>（以装修公司实测为准）。
      </p>

      <div className="overflow-hidden rounded-xl border border-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
              <th className="px-4 py-2.5">圣都套餐（档位公式）</th>
              <th className="px-4 py-2.5 text-right">硬装小计</th>
              <th className="px-4 py-2.5 text-right">含定制+管理费预估</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-stone-100">
              <td className="px-4 py-2.5 font-medium">AEs</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{fmt(q.aesHard)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{fmt(q.aesTotal)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium">A5s</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{fmt(q.a5sHard)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{fmt(q.a5sTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone-400">
        含费预估 = 硬装 + 颗粒板定制 13000 + 工程管理费 12% + 项目经理费 2%；实木芯定制 +3000。仅供参考，签约以合同为准。
      </p>
    </div>
  );
}
