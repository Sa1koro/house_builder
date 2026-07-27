import Link from "next/link";
import { BRAND_TIER_ORDER } from "@house-builder/schema";
import { createClient } from "@/lib/supabase/server";
import type { BrandRow } from "@/lib/types";
import { EnrichPrompt } from "@/components/EnrichPrompt";
import { TierBadge } from "@/components/TierBadge";

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const query = q?.trim() ?? "";
  const supabase = await createClient();

  let req = supabase.from("brands").select("*");
  if (query) {
    const safe = query.replace(/[,()."'\\%]/g, " ").trim();
    req = req.or(`name.ilike.%${safe}%,slug.eq.${safe},aliases.cs.{"${safe}"}`);
  }
  if (category) req = req.contains("categories", [category]);
  const { data } = await req.order("name");
  let brands = (data ?? []) as BrandRow[];
  // 档次从高到低排（同档按名称）
  brands = brands.sort(
    (a, b) => BRAND_TIER_ORDER.indexOf(b.tier) - BRAND_TIER_ORDER.indexOf(a.tier) || a.name.localeCompare(b.name, "zh")
  );

  // 全量品类（用于筛选 chips）
  const { data: allData } = await supabase.from("brands").select("categories");
  const allCategories = [...new Set(((allData ?? []) as { categories: string[] }[]).flatMap((b) => b.categories))].sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">品牌库</h1>
          <p className="mt-1 text-sm text-stone-500">
            档次：入门 → 主流 → 一线 → 高端；搜不到的品牌可一键外搜补全并持久化
          </p>
        </div>
        <form method="get" className="flex gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            name="q"
            defaultValue={query}
            placeholder="搜品牌：TATA / 西卡 / 伟星…"
            className="w-64 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <button className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
            搜索
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={query ? `/brands?q=${encodeURIComponent(query)}` : "/brands"}
          className={`rounded-full px-3 py-1 text-xs font-medium ${!category ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
        >
          全部品类
        </Link>
        {allCategories.map((c) => (
          <Link
            key={c}
            href={`/brands?category=${encodeURIComponent(c)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${category === c ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {brands.length === 0 && query ? (
        <EnrichPrompt kind="brand" query={query} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold text-stone-900 group-hover:text-emerald-700">{b.name}</h2>
                <TierBadge tier={b.tier} />
              </div>
              <p className="mt-1 text-xs text-stone-400">{b.categories.join(" · ") || "—"}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{b.one_liner}</p>
              {b.source === "enrich" && (
                <p className="mt-2 text-[10px] text-sky-600">外搜补全 · 置信度 {Math.round(b.confidence * 100)}%</p>
              )}
            </Link>
          ))}
          {brands.length === 0 && (
            <p className="text-sm text-stone-400 sm:col-span-2 lg:col-span-3">
              品牌库为空 —— 请先在 Supabase 执行 packages/supabase/seed.sql。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
