import {
  BrandTierSchema,
  slugify,
  type Brand,
  type BrandTier,
  type Term,
} from "@house-builder/schema";
import { z } from "zod";

export const EnrichProviderSchema = z.enum(["mock", "openai", "anthropic"]);
export type EnrichProvider = z.infer<typeof EnrichProviderSchema>;

export type EnrichBrandResult = Brand & {
  created: boolean;
  from_cache: boolean;
  raw?: unknown;
};

export type EnrichTermResult = Term & {
  created: boolean;
  from_cache: boolean;
  wiki_draft_md?: string;
  raw?: unknown;
};

export type PersistBrandFn = (brand: Brand) => Promise<Brand>;
export type PersistTermFn = (term: Term, wikiDraft?: string) => Promise<Term>;
export type FindBrandFn = (query: string) => Promise<Brand | null>;
export type FindTermFn = (query: string) => Promise<Term | null>;

const MOCK_BRAND_TIERS: Record<string, BrandTier> = {
  tata: "first_line",
  sika: "premium",
  西卡: "premium",
  飞利浦: "first_line",
  philips: "first_line",
  大自然: "first_line",
};

function guessTier(name: string): BrandTier {
  const key = name.trim().toLowerCase();
  if (MOCK_BRAND_TIERS[key] || MOCK_BRAND_TIERS[name]) {
    return MOCK_BRAND_TIERS[key] ?? MOCK_BRAND_TIERS[name]!;
  }
  if (/高端|奢|进口/.test(name)) return "premium";
  if (/一线|国际/.test(name)) return "first_line";
  return "mainstream";
}

async function callLlmJson(prompt: string): Promise<unknown | null> {
  const provider = (process.env.ENRICH_PROVIDER ?? "mock") as EnrichProvider;
  const apiKey = process.env.ENRICH_API_KEY;
  if (provider === "mock" || !apiKey) return null;

  const model = process.env.ENRICH_MODEL ?? "gpt-4o-mini";
  if (provider === "openai") {
    const base = process.env.ENRICH_BASE_URL ?? "https://api.openai.com/v1";
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "你是装修建材知识助手。只返回 JSON，字段严格按用户要求。档次用 entry|mainstream|first_line|premium。",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI enrich failed: ${res.status}`);
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  }

  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ENRICH_MODEL ?? "claude-3-5-haiku-latest",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic enrich failed: ${res.status}`);
    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }

  return null;
}

export async function lookupBrand(opts: {
  query: string;
  category?: string;
  find: FindBrandFn;
  persist: PersistBrandFn;
}): Promise<EnrichBrandResult> {
  const q = opts.query.trim();
  if (!q) throw new Error("query required");

  const existing = await opts.find(q);
  if (existing) {
    return { ...existing, created: false, from_cache: true };
  }

  const prompt = `补全装修供应商品牌信息。品牌名：${q}。品类提示：${opts.category ?? "未知"}。
返回 JSON：{"name","aliases":[],"categories":[],"tier":"entry|mainstream|first_line|premium","summary"}`;

  let raw: unknown = null;
  let name = q;
  let aliases: string[] = [];
  let categories = opts.category ? [opts.category] : ["未分类"];
  let tier = guessTier(q);
  let summary = `${q}：装修相关供应商品牌（自动补全，待人工校对）。`;
  let confidence = 0.55;

  try {
    raw = await callLlmJson(prompt);
    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      name = String(obj.name ?? q);
      aliases = Array.isArray(obj.aliases)
        ? obj.aliases.map(String)
        : [];
      categories = Array.isArray(obj.categories) && obj.categories.length
        ? obj.categories.map(String)
        : categories;
      const parsedTier = BrandTierSchema.safeParse(obj.tier);
      if (parsedTier.success) tier = parsedTier.data;
      if (typeof obj.summary === "string" && obj.summary) {
        summary = obj.summary;
        confidence = 0.75;
      }
    }
  } catch {
    // fall through to mock normalization
  }

  const brand: Brand = {
    slug: slugify(name),
    name,
    aliases: Array.from(new Set([q, ...aliases].filter(Boolean))),
    categories,
    tier,
    summary,
    source: "enrich",
    confidence,
  };

  const saved = await opts.persist(brand);
  return { ...saved, created: true, from_cache: false, raw };
}

export async function lookupTerm(opts: {
  query: string;
  category?: string;
  find: FindTermFn;
  persist: PersistTermFn;
}): Promise<EnrichTermResult> {
  const q = opts.query.trim();
  if (!q) throw new Error("query required");

  const existing = await opts.find(q);
  if (existing) {
    return { ...existing, created: false, from_cache: true };
  }

  const prompt = `解释装修名词。名词：${q}。分类提示：${opts.category ?? "装修"}。
返回 JSON：{"name","aliases":[],"summary","category","wiki_md"}`;

  let raw: unknown = null;
  let name = q;
  let aliases: string[] = [];
  let summary = `${q}：装修相关名词（自动补全，待人工校对）。`;
  let category = opts.category ?? "通用";
  let wikiDraft = `# ${q}\n\n${summary}\n`;
  let confidence = 0.55;

  try {
    raw = await callLlmJson(prompt);
    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      name = String(obj.name ?? q);
      aliases = Array.isArray(obj.aliases) ? obj.aliases.map(String) : [];
      if (typeof obj.summary === "string" && obj.summary) {
        summary = obj.summary;
        confidence = 0.75;
      }
      if (typeof obj.category === "string") category = obj.category;
      if (typeof obj.wiki_md === "string" && obj.wiki_md) {
        wikiDraft = obj.wiki_md;
      } else {
        wikiDraft = `# ${name}\n\n${summary}\n`;
      }
    }
  } catch {
    // mock path
  }

  const slug = slugify(name);
  const term: Term = {
    slug,
    name,
    aliases: Array.from(new Set([q, ...aliases].filter(Boolean))),
    summary,
    category,
    source: "enrich",
    confidence,
    wiki_slug: slug,
  };

  const saved = await opts.persist(term, wikiDraft);
  return {
    ...saved,
    created: true,
    from_cache: false,
    wiki_draft_md: wikiDraft,
    raw,
  };
}
