import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { enrichTerm } from "@house-builder/enrich";
import { DEMO_TERMS, isSupabaseConfigured } from "@/lib/demo";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing q" }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: existing } = await supabase
      .from("terms")
      .select("*")
      .or(`slug.eq.${q},title.ilike.%${q}%`)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(existing);
    }
  } else {
    const local = DEMO_TERMS.find(
      (t) => t.slug === q || t.title.includes(q)
    );
    if (local) return NextResponse.json(local);
  }

  const enriched = await enrichTerm(q, {
    provider: (process.env.ENRICH_PROVIDER as "mock") ?? "mock",
    apiKey: process.env.ENRICH_API_KEY,
  });

  if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const service = await createServiceClient();
    const { data: upserted, error } = await service
      .from("terms")
      .upsert({
        slug: enriched.slug,
        title: enriched.title,
        definition: enriched.definition,
        category: enriched.category,
        aliases: enriched.aliases ?? [],
        source: "enrich",
        confidence: enriched.confidence,
      })
      .select()
      .single();

    if (!error && upserted) {
      await service.from("enrich_jobs").insert({
        entity_type: "term",
        query: q,
        provider: (process.env.ENRICH_PROVIDER as "mock") ?? "mock",
        result_slug: enriched.slug,
        raw_response: enriched,
      });
      return NextResponse.json(upserted);
    }
  }

  return NextResponse.json(enriched);
}
