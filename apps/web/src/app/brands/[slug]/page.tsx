import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND_TIER_ORDER } from "@house-builder/schema";
import { createClient } from "@/lib/supabase/server";
import type { BrandRow } from "@/lib/types";
import { TierBadge } from "@/components/TierBadge";

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("brands").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();
  const brand = data as BrandRow;

  // 同品类品牌 → 档次对比
  const primaryCategory = brand.categories[0];
  let peers: BrandRow[] = [];
  if (primaryCategory) {
    const { data: peersData } = await supabase.from("brands").select("*").contains("categories", [primaryCategory]);
    peers = ((peersData ?? []) as BrandRow[]).sort(
      (a, b) => BRAND_TIER_ORDER.indexOf(b.tier) - BRAND_TIER_ORDER.indexOf(a.tier) || a.name.localeCompare(b.name, "zh")
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <p className="text-sm text-stone-500">
        <Link href="/brands" className="hover:text-emerald-700 hover:underline">
          ← 品牌库
        </Link>
      </p>

      <header className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-stone-900">{brand.name}</h1>
          <TierBadge tier={brand.tier} />
          {brand.source === "enrich" && (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">
              外搜补全 · 置信度 {Math.round(brand.confidence * 100)}%
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-7 text-stone-600">{brand.one_liner ?? "暂无介绍"}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-stone-400">品类</dt>
            <dd className="mt-0.5 text-stone-700">{brand.categories.join(" · ") || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-stone-400">国家/地区</dt>
            <dd className="mt-0.5 text-stone-700">{brand.country ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-stone-400">别名</dt>
            <dd className="mt-0.5 text-stone-700">{brand.aliases.join(" / ") || "—"}</dd>
          </div>
        </dl>
      </header>

      {primaryCategory && peers.length > 1 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">同品类档次对比 · {primaryCategory}</h2>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-500">
                  <th className="px-4 py-3">品牌</th>
                  <th className="px-4 py-3">档次</th>
                  <th className="px-4 py-3">一句话</th>
                </tr>
              </thead>
              <tbody>
                {peers.map((p) => (
                  <tr
                    key={p.slug}
                    className={`border-b border-stone-100 last:border-0 ${p.slug === brand.slug ? "bg-emerald-50/60" : ""}`}
                  >
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/brands/${p.slug}`} className="text-stone-900 hover:text-emerald-700">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <TierBadge tier={p.tier} />
                    </td>
                    <td className="px-4 py-3 text-stone-600">{p.one_liner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
