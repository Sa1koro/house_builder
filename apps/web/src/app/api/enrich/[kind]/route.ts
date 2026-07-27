import { NextResponse } from "next/server";
import { enrichEntity } from "@/lib/enrich";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (kind !== "brand" && kind !== "term") return NextResponse.json({ error: "kind 仅支持 brand 或 term" }, { status: 404 });
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录后使用补全" }, { status: 401 });
  try {
    const body = await request.json();
    const result = await enrichEntity(kind, String(body.query ?? ""));
    return NextResponse.json(result, { status: result.cached ? 200 : 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "补全失败" }, { status: 502 });
  }
}

export async function GET(request: Request, context: { params: Promise<{ kind: string }> }) {
  const url = new URL(request.url);
  return POST(new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify({ query: url.searchParams.get("q") ?? "" }),
  }), context);
}
