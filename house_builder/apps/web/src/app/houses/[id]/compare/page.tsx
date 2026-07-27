import Link from "next/link";
import { getHouse, listProposals, listTerms } from "@/lib/data";
import {
  CompareCosts,
  CompareExport,
  CompareLineItems,
} from "@/components/compare-tables";
import { notFound } from "next/navigation";

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { id } = await params;
  const { a: aId, b: bId } = await searchParams;
  const house = await getHouse(id);
  if (!house) notFound();

  const proposals = await listProposals(id);
  const a = proposals.find((p) => p.id === aId) ?? proposals[0];
  const b = proposals.find((p) => p.id === bId) ?? proposals[1];
  if (!a || !b) notFound();

  const termsList = await listTerms();
  const terms = Object.fromEntries(termsList.map((t) => [t.slug, t]));

  const baseDiff =
    Number(b.costs.base_particle) - Number(a.costs.base_particle);
  const totalDiff =
    Number(b.costs.total_particle) - Number(a.costs.total_particle);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-[var(--muted)]">
          <Link href="/houses" className="hover:text-[var(--sage)]">
            房屋
          </Link>{" "}
          / {house.name}
        </p>
        <h1 className="display mt-2 text-3xl font-semibold md:text-4xl">
          {a.package_name} vs {b.package_name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          售卖 {house.sales_area_sqm}㎡ · 计价 {house.billing_area_sqm}㎡ ·{" "}
          {a.company}
        </p>
        <p className="mt-4 rounded-lg border border-[var(--line)] bg-white/60 px-4 py-3 text-sm">
          颗粒板全案基础价差额约{" "}
          <strong>{baseDiff.toLocaleString("zh-CN")} 元</strong>
          ；含管理费+项目经理费后约{" "}
          <strong>{totalDiff.toLocaleString("zh-CN")} 元</strong>。
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="display text-xl font-semibold">总价拆解</h2>
        <CompareCosts a={a} b={b} terms={terms} />
      </section>

      <section className="space-y-3">
        <h2 className="display text-xl font-semibold">配置差异</h2>
        <CompareLineItems a={a} b={b} terms={terms} />
      </section>

      <section className="space-y-3">
        <h2 className="display text-xl font-semibold">导出</h2>
        <CompareExport a={a} b={b} />
      </section>
    </div>
  );
}
