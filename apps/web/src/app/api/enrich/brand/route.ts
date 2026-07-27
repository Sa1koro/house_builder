import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { enrichBrand } from "@house-builder/enrich";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing q" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("brands")
    .select("*")
    .or(`slug.eq.${q},name.ilike.%${q}%`)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(existing);
  }

  const enriched = await enrichBrand(q, {
    provider: (process.env.ENRICH_PROVIDER as "mock") ?? "mock",
    apiKey: process.env.ENRICH_API_KEY,
    searchUrl: process.env.ENRICH_SEARCH_URL,
  });

  const service = await createServiceClient();
  const { data: upserted, error } = await service
    .from("brands")
    .upsert({
      slug: enriched.slug,
      name: enriched.name,
      categories: enriched.categories,
      tier: enriched.tier,
      aliases: enriched.aliases ?? [],
      summary: enriched.summary,
      source: "enrich",
      confidence: enriched.confidence,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await service.from("enrich_jobs").insert({
    entity_type: "brand",
    query: q,
    provider: (process.env.ENRICH_PROVIDER as "mock") ?? "mock",
    result_slug: enriched.slug,
    raw_response: enriched,
  });

  return NextResponse.json(upserted);
}
