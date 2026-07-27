import Link from "next/link";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { enrichTerm } from "@house-builder/enrich";

export default async function WikiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  let { data: term } = await supabase
    .from("terms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!term) {
    const enriched = await enrichTerm(slug, {
      provider: (process.env.ENRICH_PROVIDER as "mock") ?? "mock",
      apiKey: process.env.ENRICH_API_KEY,
    });
    const service = await createServiceClient();
    await service.from("terms").upsert({
      slug: enriched.slug,
      title: enriched.title,
      definition: enriched.definition,
      category: enriched.category,
      source: "enrich",
      confidence: enriched.confidence,
    });
    await service.from("enrich_jobs").insert({
      entity_type: "term",
      query: slug,
      provider: "mock",
      result_slug: enriched.slug,
    });
    term = enriched as typeof term;
  }

  if (!term) notFound();

  const { data: wikiPage } = await supabase
    .from("wiki_pages")
    .select("*")
    .or(`term_slug.eq.${slug},slug.eq.${slug}`)
    .maybeSingle();

  return (
    <article className="space-y-6 max-w-3xl">
      <Link href="/wiki" className="text-sm text-[var(--muted)]">
        ← Wiki 列表
      </Link>
      <header>
        <h1 className="text-3xl font-bold">{term.title}</h1>
        {term.category && (
          <span className="badge badge-aes mt-2">{term.category}</span>
        )}
      </header>
      <p className="text-lg leading-relaxed">{term.definition}</p>
      {wikiPage && (
        <section className="card prose prose-sm max-w-none">
          <h2 className="font-semibold text-lg mb-2">{wikiPage.title}</h2>
          <div className="whitespace-pre-wrap text-gray-700">
            {wikiPage.content}
          </div>
        </section>
      )}
      <p className="text-xs text-[var(--muted)]">
        来源：{term.source ?? "seed"} · 公共词条，所有用户可见
      </p>
    </article>
  );
}
