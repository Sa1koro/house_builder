import Link from "next/link";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { enrichBrand } from "@house-builder/enrich";
import { BRAND_TIER_LABELS } from "@house-builder/schema";

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  let { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!brand) {
    const enriched = await enrichBrand(slug, {
      provider: (process.env.ENRICH_PROVIDER as "mock") ?? "mock",
      apiKey: process.env.ENRICH_API_KEY,
    });
    const service = await createServiceClient();
    await service.from("brands").upsert({
      slug: enriched.slug,
      name: enriched.name,
      categories: enriched.categories,
      tier: enriched.tier,
      aliases: enriched.aliases ?? [],
      summary: enriched.summary,
      source: "enrich",
      confidence: enriched.confidence,
    });
    await service.from("enrich_jobs").insert({
      entity_type: "brand",
      query: slug,
      provider: "mock",
      result_slug: enriched.slug,
      raw_response: enriched as unknown as Record<string, unknown>,
    });
    brand = enriched as typeof brand;
  }

  if (!brand) notFound();

  const { data: wikiPage } = await supabase
    .from("wiki_pages")
    .select("*")
    .eq("brand_slug", slug)
    .maybeSingle();

  const { data: sameCategory } = await supabase
    .from("brands")
    .select("slug, name, tier")
    .overlaps("categories", brand.categories ?? [])
    .neq("slug", slug)
    .limit(6);

  return (
    <article className="space-y-6 max-w-3xl">
      <Link href="/brands" className="text-sm text-[var(--muted)]">
        ← 品牌库
      </Link>
      <header>
        <h1 className="text-3xl font-bold">{brand.name}</h1>
        <div className="flex gap-2 mt-2 flex-wrap">
          <span className="badge badge-aes">
            {BRAND_TIER_LABELS[brand.tier as keyof typeof BRAND_TIER_LABELS]}
          </span>
          {brand.categories?.map((c: string) => (
            <span key={c} className="badge badge-a5s">
              {c}
            </span>
          ))}
        </div>
      </header>
      {brand.summary && (
        <p className="text-lg leading-relaxed">{brand.summary}</p>
      )}
      {wikiPage && (
        <section className="card">
          <h2 className="font-semibold mb-2">{wikiPage.title}</h2>
          <p className="whitespace-pre-wrap text-gray-700">
            {wikiPage.content}
          </p>
        </section>
      )}
      {sameCategory && sameCategory.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">同品类对比</h2>
          <ul className="space-y-1 text-sm">
            {sameCategory.map((b) => (
              <li key={b.slug}>
                <Link href={`/brands/${b.slug}`} className="underline">
                  {b.name}
                </Link>
                <span className="text-[var(--muted)] ml-2">
                  {BRAND_TIER_LABELS[b.tier as keyof typeof BRAND_TIER_LABELS]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="text-xs text-[var(--muted)]">
        来源：{brand.source ?? "seed"} · 公共品牌库
      </p>
    </article>
  );
}
