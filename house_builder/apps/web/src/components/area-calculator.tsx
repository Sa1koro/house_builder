"use client";

import { useState, useTransition } from "react";

export function AreaCalculator() {
  const [sales, setSales] = useState(90);
  const [billing, setBilling] = useState(76.34);
  const [packageName, setPackageName] = useState<"AEs" | "A5s">("AEs");
  const [result, setResult] = useState<string>("");

  function calc() {
    const area = billing;
    if (!(area >= 50 && area < 80)) {
      setResult("当前计算器仅覆盖 50≤计价面积<80 档公式（Demo）。");
      return;
    }
    const hardBase = packageName === "AEs" ? 65000 : 75800;
    const unit = packageName === "AEs" ? 699 : 799;
    const over = area - 50;
    const hard = hardBase + over * unit;
    const baseP = hard + 13000;
    const totalP = baseP + hard * 0.12 + hard * 0.02;
    setResult(
      `${packageName} · 计价 ${area}㎡（售卖 ${sales}㎡）\n硬装小计 ≈ ${hard.toFixed(2)}\n全案基础价(颗粒板) ≈ ${baseP.toFixed(2)}\n含费预估(颗粒板) ≈ ${totalP.toFixed(2)}`,
    );
  }

  const [pending, start] = useTransition();

  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/70 p-5">
      <h2 className="display text-lg font-semibold">计价面积速算</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        基于圣都宣传页 50≤S&lt;80 档公式（Demo）。
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-sm">
          售卖面积
          <input
            type="number"
            value={sales}
            onChange={(e) => setSales(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2"
          />
        </label>
        <label className="text-sm">
          计价面积
          <input
            type="number"
            value={billing}
            onChange={(e) => setBilling(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2"
          />
        </label>
        <label className="text-sm">
          套餐
          <select
            value={packageName}
            onChange={(e) => setPackageName(e.target.value as "AEs" | "A5s")}
            className="mt-1 w-full rounded-md border border-[var(--line)] px-3 py-2"
          >
            <option value="AEs">AEs</option>
            <option value="A5s">A5s</option>
          </select>
        </label>
      </div>
      <button
        type="button"
        className="mt-4 rounded-md bg-[var(--sage)] px-4 py-2 text-sm text-white hover:bg-[var(--sage-deep)]"
        onClick={() => start(() => calc())}
        disabled={pending}
      >
        计算
      </button>
      {result ? (
        <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-[var(--paper)] p-3 text-sm text-[var(--ink)]">
          {result}
        </pre>
      ) : null}
    </div>
  );
}
