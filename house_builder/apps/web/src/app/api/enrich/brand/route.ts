import { NextResponse } from "next/server";
import { lookupBrand } from "@house-builder/enrich";
import {
  findBrandLocalOrDb,
  persistBrand,
  recordEnrichJob,
} from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = String(body.query ?? "").trim();
    if (!query) {
      return NextResponse.json({ error: "query required" }, { status: 400 });
    }

    const result = await lookupBrand({
      query,
      category: body.category,
      find: findBrandLocalOrDb,
      persist: persistBrand,
    });

    await recordEnrichJob({
      kind: "brand",
      query,
      provider: process.env.ENRICH_PROVIDER ?? "mock",
      raw: result.raw ?? null,
      result_slug: result.slug,
      status: "ok",
    });

    return NextResponse.json({
      brand: result,
      created: result.created,
      from_cache: result.from_cache,
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
  const fakeReq = new Request(request.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, category: searchParams.get("category") }),
  });
  return POST(fakeReq);
}
