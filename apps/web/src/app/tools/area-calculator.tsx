"use client";

import { useMemo, useState } from "react";

export function AreaCalculator() {
  const [base, setBase] = useState(65_000);
  const [included, setIncluded] = useState(50);
  const [area, setArea] = useState(76.34);
  const [unit, setUnit] = useState(699);
  const result = useMemo(() => base + Math.max(0, area - included) * unit, [base, included, area, unit]);
  return (
    <div className="paper rounded-3xl p-6">
      <h2 className="text-xl font-semibold">计价面积计算器</h2>
      <p className="mt-2 text-sm text-[#65736b]">按“档位基础价 + 超出面积 × 单价”估算硬装小计。</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[["档位基础价", base, setBase], ["档位含面积㎡", included, setIncluded], ["实际计价面积㎡", area, setArea], ["超面积单价", unit, setUnit]].map(([label, value, setter]) => <label key={String(label)} className="text-xs text-[#65736b]">{label}<input type="number" step=".01" value={value as number} onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))} className="mt-2 w-full rounded-xl bg-[#f5f3ee] px-4 py-3 text-base text-[#18221d] outline-none" /></label>)}
      </div>
      <div className="mt-6 rounded-2xl bg-[#174c36] p-5 text-white"><p className="text-xs text-white/60">硬装小计估算</p><p className="mt-1 text-3xl font-semibold">¥ {result.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}</p></div>
    </div>
  );
}
