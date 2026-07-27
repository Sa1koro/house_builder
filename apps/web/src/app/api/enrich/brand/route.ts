import { NextResponse } from "next/server";
import { enrichConfigFromEnv, lookupBrand } from "@house-builder/enrich";

/**
 * 品牌冷启动补全：先查 DB → miss 则外搜/LLM → upsert brands + enrich_jobs。
 * GET  /api/enrich/brand?q=贝朗
 * POST /api/enrich/brand { "query": "贝朗" }
 */
async function handle(query: string | null) {
  if (!query || !query.trim() || query.trim().length > 50) {
    return NextResponse.json({ error: "请提供 1-50 字的品牌名 query" }, { status: 400 });
  }
  try {
    const { brand, hit } = await lookupBrand(query.trim(), enrichConfigFromEnv());
    return NextResponse.json({ hit, brand });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "enrich 失败" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return handle(new URL(request.url).searchParams.get("q"));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { query?: string } | null;
  return handle(body?.query ?? null);
}
