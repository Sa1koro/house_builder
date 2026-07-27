import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BRAND_TIER_LABELS, type BrandTier } from "@house-builder/schema";
import { DEMO_BRANDS, isSupabaseConfigured } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  let brands = DEMO_BRANDS;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase.from("brands").select("*").order("tier").order("name");

    if (q) {
      query = query.or(`name.ilike.%${q}%,summary.ilike.%${q}%`);
    }
    if (category) {
      query = query.contains("categories", [category]);
    }

    const { data } = await query.limit(100);
    if (data?.length) brands = data;
  } else if (q) {
    brands = DEMO_BRANDS.filter(
      (b) => b.name.includes(q) || b.summary?.includes(q)
    );
  }

  const tiers: BrandTier[] = ["premium", "first_tier", "mainstream", "entry"];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">品牌库</h1>
      <form className="flex gap-2 flex-wrap">
        <input
          name="q"
          defaultValue={q}
          placeholder="搜索品牌…"
          className="flex-1 min-w-[200px] border rounded-lg px-3 py-2"
        />
        <input
          name="category"
          defaultValue={category}
          placeholder="品类筛选"
          className="border rounded-lg px-3 py-2"
        />
        <button type="submit" className="btn btn-primary">
          搜索
        </button>
      </form>

      {q && (!brands || brands.length === 0) && (
        <div className="card bg-[var(--primary-light)]">
          <p>
            未找到「{q}」，
            <Link
              href={`/api/enrich/brand?q=${encodeURIComponent(q)}`}
              className="underline font-medium"
            >
              点击自动补全并入库
            </Link>
          </p>
        </div>
      )}

      {tiers.map((tier) => {
        const tierBrands = (brands ?? []).filter((b) => b.tier === tier);
        if (tierBrands.length === 0) return null;
        return (
          <section key={tier}>
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span className="badge badge-aes">{BRAND_TIER_LABELS[tier]}</span>
              <span className="text-sm text-[var(--muted)]">
                ({tierBrands.length})
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {tierBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="card hover:border-[var(--primary)] block"
                >
                  <div className="font-medium">{brand.name}</div>
                  <div className="text-xs text-[var(--muted)] mt-1">
                    {brand.categories?.join(" · ")}
                  </div>
                  {brand.summary && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {brand.summary}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
