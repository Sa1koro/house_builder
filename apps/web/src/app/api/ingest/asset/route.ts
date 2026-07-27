import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function checkToken(request: Request): boolean {
  const token = process.env.INGEST_WORKER_TOKEN;
  if (!token) return false;
  return request.headers.get("authorization") === `Bearer ${token}`;
}

/** 本地 OCR worker 用：按 asset_id 取原件信息（blob_url 等）。 */
export async function GET(request: Request) {
  if (!checkToken(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "缺少 id" }, { status: 400 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("proposal_assets")
    .select("id, house_id, blob_url, pathname, mime, ocr_status")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "asset 不存在" }, { status: 404 });

  // 标记为解析中
  await db.from("proposal_assets").update({ ocr_status: "processing", updated_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json(data);
}
