import { NextResponse } from "next/server";
import { enrichConfigFromEnv, lookupTerm } from "@house-builder/enrich";

/**
 * 名词冷启动补全：先查 DB → miss 则外搜/LLM → upsert terms（可选 wiki 草稿）+ enrich_jobs。
 * GET  /api/enrich/term?q=瓦工
 * POST /api/enrich/term { "query": "瓦工" }
 */
async function handle(query: string | null) {
  if (!query || !query.trim() || query.trim().length > 50) {
    return NextResponse.json({ error: "请提供 1-50 字的名词 query" }, { status: 400 });
  }
  try {
    const { term, hit } = await lookupTerm(query.trim(), enrichConfigFromEnv());
    return NextResponse.json({ hit, term });
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
