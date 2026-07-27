import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const brandResult = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  tier: z.enum(["入门", "主流", "一线", "高端"]),
  summary: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  wiki: z.string().min(1),
});

const termResult = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  wiki: z.string().min(1),
});

function safeSlug(value: string) {
  const slug = value.normalize("NFKC").trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
  if (!slug) throw new Error("无法生成稳定 slug");
  return slug.slice(0, 100);
}

async function callProvider(kind: "brand" | "term", query: string) {
  const url = process.env.ENRICH_API_URL;
  const apiKey = process.env.ENRICH_API_KEY;
  if (!url || !apiKey) throw new Error("未配置 ENRICH_API_URL / ENRICH_API_KEY");
  const schemaHint = kind === "brand"
    ? '{"name":"规范名","slug":"latin-or-chinese-slug","category":"品类","tier":"入门|主流|一线|高端","summary":"谨慎的一句话说明","aliases":[],"wiki":"Markdown，含核对要点"}'
    : '{"name":"规范名","slug":"稳定 slug","summary":"通俗的一句话定义","aliases":[],"wiki":"Markdown，含合同和验收要点"}';
  const response = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.ENRICH_MODEL ?? "gpt-4.1-mini",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `你是中国家装知识库编辑。只返回 JSON ${schemaHint}。不确定时降低表述强度，不虚构认证、排名或产品参数。档次仅为市场定位参考。` },
        { role: "user", content: `请检索并规范化这个${kind === "brand" ? "装修品牌" : "装修名词"}：${query}` },
      ],
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`补全服务返回 ${response.status}`);
  const raw = await response.json();
  const content = raw.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("补全服务响应缺少 content");
  return { raw, parsed: JSON.parse(content.replace(/^```json\s*|\s*```$/g, "")) };
}

export async function enrichEntity(kind: "brand" | "term", query: string) {
  const admin = createSupabaseAdminClient();
  const table = kind === "brand" ? "brands" : "terms";
  const normalized = query.normalize("NFKC").trim();
  if (!normalized || normalized.length > 80) throw new Error("查询长度应为 1–80 字");
  const { data: hit } = await admin.from(table).select("*").ilike("name", normalized).maybeSingle();
  if (hit) {
    await admin.from("enrich_jobs").insert({ kind, query: normalized, provider: "database", result_id: hit.id, status: "hit" });
    return { cached: true, entity: hit };
  }
  const provider = process.env.ENRICH_API_URL ? new URL(process.env.ENRICH_API_URL).hostname : "unconfigured";
  try {
    const { raw, parsed } = await callProvider(kind, normalized);
    let entity: Record<string, unknown> & { id: string };
    let value: z.infer<typeof brandResult> | z.infer<typeof termResult>;
    if (kind === "brand") {
      const brand = brandResult.parse(parsed);
      value = brand;
      const slug = safeSlug(brand.slug || brand.name);
      const { data, error } = await admin.from("brands").upsert({
        slug, name: brand.name, category: brand.category, tier: brand.tier,
        summary: brand.summary, aliases: brand.aliases, source: "enrich", confidence: 0.7,
      }, { onConflict: "slug" }).select("*").single();
      if (error) throw error;
      entity = data;
    } else {
      const term = termResult.parse(parsed);
      value = term;
      const slug = safeSlug(term.slug || term.name);
      const { data, error } = await admin.from("terms").upsert({
        slug, name: term.name, summary: term.summary, aliases: term.aliases,
        source: "enrich", confidence: 0.7,
      }, { onConflict: "slug" }).select("*").single();
      if (error) throw error;
      entity = data;
    }
    const slug = safeSlug(value.slug || value.name);
    await admin.from("wiki_pages").upsert({ slug, title: value.name, kind, entity_id: entity.id, body_md: value.wiki, source: "enrich", is_published: true }, { onConflict: "slug" });
    await admin.from("enrich_jobs").insert({ kind, query: normalized, provider, raw, result_id: entity.id, status: "created" });
    return { cached: false, entity };
  } catch (error) {
    await admin.from("enrich_jobs").insert({ kind, query: normalized, provider, status: "failed", error: error instanceof Error ? error.message : "unknown" });
    throw error;
  }
}
