/**
 * 品牌/名词冷启动补全（定死流程）：
 *   1. 先查 Postgres（slug / name / aliases / 模糊）
 *   2. Miss → 外搜（可选）→ LLM 规范化（档次 + 一句话释义）
 *   3. Upsert 公共表 + 写 enrich_jobs 审计（可选生成 wiki_pages 草稿）
 *   4. 返回稳定 slug，前端悬停与检索立即可用
 *
 * 未配置 LLM 时降级为低置信度占位条目（confidence 0.2），
 * 保证流程闭环（刷新仍在），后续可由 LLM/人工提升置信度。
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  BRAND_TIER_ORDER,
  toSlug,
  type Brand,
  type BrandTier,
  type Term,
} from "@house-builder/schema";
import { hasLlm, type EnrichConfig } from "./config";
import { llmJson, webSearch, type SearchSnippet } from "./providers";

export { enrichConfigFromEnv, hasLlm, type EnrichConfig } from "./config";

export type EnrichHit = "db" | "enriched" | "placeholder";

export interface BrandRow extends Brand {
  id: string;
}
export interface TermRow extends Term {
  id: string;
}

function serviceClient(config: EnrichConfig): SupabaseClient {
  return createClient(config.supabaseUrl, config.serviceRoleKey, {
    auth: { persistSession: false },
  });
}

/** 防止 or 过滤串注入：去掉 PostgREST 逻辑串里的保留字符 */
function sanitize(q: string): string {
  return q.replace(/[,()."'\\]/g, " ").trim();
}

async function logJob(
  db: SupabaseClient,
  kind: "brand" | "term",
  query: string,
  provider: string,
  status: "hit" | "enriched" | "placeholder" | "failed",
  raw: unknown,
  resultId: string | null
): Promise<void> {
  await db.from("enrich_jobs").insert({
    kind,
    query,
    provider,
    status,
    raw: raw ?? null,
    result_id: resultId,
  });
}

function coerceTier(v: unknown): BrandTier {
  return BRAND_TIER_ORDER.includes(v as BrandTier) ? (v as BrandTier) : "mainstream";
}

function coerceStrArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

// ---------------- Brand ----------------

async function findBrand(db: SupabaseClient, query: string): Promise<BrandRow | null> {
  const q = sanitize(query);
  if (!q) return null;
  const { data } = await db
    .from("brands")
    .select("*")
    .or(`slug.eq.${q},name.eq.${q},name.ilike.%${q}%,aliases.cs.{"${q}"}`)
    .limit(1);
  return (data?.[0] as BrandRow | undefined) ?? null;
}

export async function lookupBrand(
  query: string,
  config: EnrichConfig
): Promise<{ brand: BrandRow; hit: EnrichHit }> {
  const db = serviceClient(config);
  const existing = await findBrand(db, query);
  if (existing) {
    await logJob(db, "brand", query, "db-hit", "hit", null, existing.id);
    return { brand: existing, hit: "db" };
  }

  const snippets = await webSearch(`${query} 品牌 装修 建材 档次`, config);
  let payload: Record<string, unknown> | null = null;
  if (hasLlm(config)) {
    payload = await llmJson(
      [
        "你是家装建材品牌知识库编辑。根据用户给的品牌名（可能是中文/英文/误写）和检索片段，输出 JSON：",
        '{"name":"规范中文名","slug":"小写拼音或英文-连字符","aliases":["别名"],"categories":["品类"],',
        '"tier":"entry|mainstream|premium|luxury","one_liner":"一句话介绍(≤60字)","country":"国家","confidence":0到1}',
        "tier 含义：entry=入门 mainstream=主流 premium=一线 luxury=高端。不确定时 tier 用 mainstream 且降低 confidence。",
      ].join("\n"),
      JSON.stringify({ query, search_results: snippets satisfies SearchSnippet[] }),
      config
    );
  }

  const provider = payload
    ? snippets.length > 0
      ? "tavily+llm"
      : "llm"
    : "placeholder";

  const record = {
    slug: typeof payload?.slug === "string" && payload.slug ? toSlug(payload.slug as string) : toSlug(query),
    name: typeof payload?.name === "string" && payload.name ? (payload.name as string) : query.trim(),
    aliases: coerceStrArray(payload?.aliases),
    categories: coerceStrArray(payload?.categories),
    tier: coerceTier(payload?.tier),
    one_liner:
      typeof payload?.one_liner === "string"
        ? (payload.one_liner as string)
        : "待补全：未配置 enrich LLM，暂以占位条目入库。",
    country: typeof payload?.country === "string" ? (payload.country as string) : null,
    source: "enrich" as const,
    confidence: payload ? Math.min(Math.max(Number(payload.confidence ?? 0.6), 0), 1) : 0.2,
  };

  const { data: upserted, error } = await db
    .from("brands")
    .upsert(record, { onConflict: "slug" })
    .select("*")
    .single();
  if (error || !upserted) {
    await logJob(db, "brand", query, provider, "failed", { error: error?.message, payload }, null);
    throw new Error(`brand upsert 失败: ${error?.message}`);
  }
  await logJob(
    db,
    "brand",
    query,
    provider,
    payload ? "enriched" : "placeholder",
    { payload, snippets },
    (upserted as BrandRow).id
  );
  return { brand: upserted as BrandRow, hit: payload ? "enriched" : "placeholder" };
}

// ---------------- Term ----------------

async function findTerm(db: SupabaseClient, query: string): Promise<TermRow | null> {
  const q = sanitize(query);
  if (!q) return null;
  const { data } = await db
    .from("terms")
    .select("*")
    .or(`slug.eq.${q},name.eq.${q},name.ilike.%${q}%,aliases.cs.{"${q}"}`)
    .limit(1);
  return (data?.[0] as TermRow | undefined) ?? null;
}

export async function lookupTerm(
  query: string,
  config: EnrichConfig
): Promise<{ term: TermRow; hit: EnrichHit }> {
  const db = serviceClient(config);
  const existing = await findTerm(db, query);
  if (existing) {
    await logJob(db, "term", query, "db-hit", "hit", null, existing.id);
    return { term: existing, hit: "db" };
  }

  const snippets = await webSearch(`${query} 装修 名词解释`, config);
  let payload: Record<string, unknown> | null = null;
  if (hasLlm(config)) {
    payload = await llmJson(
      [
        "你是装修知识 Wiki 编辑。根据用户给的装修名词和检索片段，输出 JSON：",
        '{"name":"规范名词","slug":"小写拼音-连字符","aliases":["别名"],',
        '"short_def":"一句话释义(≤80字，业主视角，讲清是什么+为什么重要)",',
        '"wiki_md":"可选：200-400字 Markdown 长文（## 是什么 / ## 报价里怎么看 / ## 常见坑）","confidence":0到1}',
      ].join("\n"),
      JSON.stringify({ query, search_results: snippets satisfies SearchSnippet[] }),
      config
    );
  }

  const provider = payload ? (snippets.length > 0 ? "tavily+llm" : "llm") : "placeholder";

  const record = {
    slug: typeof payload?.slug === "string" && payload.slug ? toSlug(payload.slug as string) : toSlug(query),
    name: typeof payload?.name === "string" && payload.name ? (payload.name as string) : query.trim(),
    aliases: coerceStrArray(payload?.aliases),
    short_def:
      typeof payload?.short_def === "string"
        ? (payload.short_def as string)
        : "待补全：未配置 enrich LLM，暂以占位条目入库。",
    source: "enrich" as const,
    confidence: payload ? Math.min(Math.max(Number(payload.confidence ?? 0.6), 0), 1) : 0.2,
  };

  const { data: upserted, error } = await db
    .from("terms")
    .upsert(record, { onConflict: "slug" })
    .select("*")
    .single();
  if (error || !upserted) {
    await logJob(db, "term", query, provider, "failed", { error: error?.message, payload }, null);
    throw new Error(`term upsert 失败: ${error?.message}`);
  }

  // 可选：LLM 给了长文则生成 wiki 草稿（draft，不直接对外发布）
  if (typeof payload?.wiki_md === "string" && (payload.wiki_md as string).length > 50) {
    await db.from("wiki_pages").upsert(
      {
        slug: record.slug,
        term_slug: record.slug,
        title: record.name,
        body_md: payload.wiki_md as string,
        status: "draft",
        source: "enrich",
      },
      { onConflict: "slug", ignoreDuplicates: true }
    );
  }

  await logJob(
    db,
    "term",
    query,
    provider,
    payload ? "enriched" : "placeholder",
    { payload, snippets },
    (upserted as TermRow).id
  );
  return { term: upserted as TermRow, hit: payload ? "enriched" : "placeholder" };
}
