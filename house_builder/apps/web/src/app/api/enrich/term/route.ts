import { NextResponse } from "next/server";
import { lookupTerm } from "@house-builder/enrich";
import {
  findTermLocalOrDb,
  persistTerm,
  recordEnrichJob,
} from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = String(body.query ?? "").trim();
    if (!query) {
      return NextResponse.json({ error: "query required" }, { status: 400 });
    }

    const result = await lookupTerm({
      query,
      category: body.category,
      find: findTermLocalOrDb,
      persist: persistTerm,
    });

    await recordEnrichJob({
      kind: "term",
      query,
      provider: process.env.ENRICH_PROVIDER ?? "mock",
      raw: result.raw ?? null,
      result_slug: result.slug,
      status: "ok",
    });

    return NextResponse.json({
      term: result,
      created: result.created,
      from_cache: result.from_cache,
      wiki_draft_md: result.wiki_draft_md,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "enrich failed" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "q required" }, { status: 400 });
  }
  return POST(
    new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, category: searchParams.get("category") }),
    }),
  );
}
