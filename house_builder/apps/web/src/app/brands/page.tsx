import { listBrands } from "@/lib/data";
import { BrandEnrichForm } from "@/components/brand-enrich-form";
import { TierBadge } from "@/components/tier-badge";
import { BRAND_TIER_LABELS, type BrandTier } from "@house-builder/schema";

const tierOrder: BrandTier[] = ["entry", "mainstream", "first_line", "premium"];

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  let brands = await listBrands(q);
  if (category) {
    brands = brands.filter((b) => b.categories.includes(category));
  }

  const byTier = tierOrder.map((tier) => ({
    tier,
    items: brands.filter((b) => b.tier === tier),
  }));

  const categories = Array.from(
    new Set(brands.flatMap((b) => b.categories)),
  ).sort();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="display text-3xl font-semibold">品牌库</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          检索、档次标签与同品类对比。公共可读；写入由 enrich / service role 完成。
        </p>
        <form className="mt-4 flex flex-wrap gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="搜索品牌…"
            className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm"
          />
          <select
            name="category"
            defaultValue={category ?? ""}
            className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm"
          >
            <option value="">全部品类</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-md bg-[var(--sage)] px-3 py-2 text-sm text-white">
            筛选
          </button>
        </form>
      </div>

      <BrandEnrichForm />

      <section className="space-y-6">
        <h2 className="display text-xl font-semibold">档次对比</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {byTier.map(({ tier, items }) => (
            <div key={tier} className="border-t border-[var(--line)] pt-3">
              <div className="mb-3 flex items-center gap-2">
                <TierBadge tier={tier} />
                <span className="text-xs text-[var(--muted)]">
                  {BRAND_TIER_LABELS[tier]} · {items.length}
                </span>
              </div>
              <ul className="space-y-2 text-sm">
                {items.map((b) => (
                  <li key={b.slug}>
                    <span className="font-medium">{b.name}</span>
                    <span className="block text-xs text-[var(--muted)]">
                      {b.categories.join(" · ")}
                    </span>
                  </li>
                ))}
                {!items.length ? (
                  <li className="text-xs text-[var(--muted)]">暂无</li>
                ) : null}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="display text-xl font-semibold">全部品牌</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white/70">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--sage-deep)] text-white">
              <tr>
                <th className="px-4 py-3">品牌</th>
                <th className="px-4 py-3">品类</th>
                <th className="px-4 py-3">档次</th>
                <th className="px-4 py-3">简介</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.slug} className="border-t border-[var(--line)] align-top">
                  <td className="px-4 py-2.5 font-medium">{b.name}</td>
                  <td className="px-4 py-2.5">{b.categories.join("、")}</td>
                  <td className="px-4 py-2.5">
                    <TierBadge tier={b.tier} />
                  </td>
                  <td className="px-4 py-2.5 text-[var(--muted)]">{b.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
