import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const allowedKinds = ["brand", "term"] as const;
type Kind = (typeof allowedKinds)[number];
const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");

export async function POST(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!allowedKinds.includes(kind as Kind)) return Response.json({ error: "Unknown enrich kind" }, { status: 404 });
  const { query } = await request.json() as { query?: string };
  if (!query?.trim()) return Response.json({ error: "query is required" }, { status: 400 });
  const session = await createClient();
  const { data: { user } } = await session.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const table = kind === "brand" ? "brands" : "terms";
  const { data: existing } = await admin.from(table).select("*").eq("slug", slugify(query)).limit(1);
  if (existing?.[0]) return Response.json({ data: existing[0], cached: true });

  // A provider may return normalized JSON; without one, persist a clearly low-confidence draft for review.
  const normalized = { slug: slugify(query), title: query.trim(), summary: `待审核的${kind === "brand" ? "品牌" : "装修名词"}词条。` };
  if (process.env.ENRICH_API_URL && process.env.ENRICH_API_KEY) {
    const remote = await fetch(process.env.ENRICH_API_URL, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.ENRICH_API_KEY}` }, body: JSON.stringify({ kind, query }) });
    if (remote.ok) Object.assign(normalized, await remote.json());
  }
  const record = kind === "brand"
    ? { slug: normalized.slug, name: normalized.title, category: "待分类", tier: "mainstream", summary: normalized.summary, source: "enrich", confidence: 0.3 }
    : { slug: normalized.slug, title: normalized.title, summary: normalized.summary, source: "enrich", confidence: 0.3 };
  const { data, error } = await admin.from(table).upsert(record).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  await admin.from("enrich_jobs").insert({ query, kind, provider: process.env.ENRICH_API_URL ? "configured_api" : "draft_fallback", result_slug: normalized.slug });
  return Response.json({ data, cached: false });
}
