import { NextResponse } from "next/server";
import { validateProposal } from "@house-builder/schema";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * 本地 OCR worker 推回 draft Proposal JSON。
 * 只写 proposal_assets.ocr_draft（状态 draft_ready），不直接进 proposals——
 * 必须经 Web 校对页人工确认后才入库。
 */
export async function POST(request: Request) {
  const token = process.env.INGEST_WORKER_TOKEN;
  if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    asset_id?: string;
    draft?: unknown;
    error?: string;
  } | null;
  if (!body?.asset_id) return NextResponse.json({ error: "缺少 asset_id" }, { status: 400 });

  const db = createAdminClient();

  if (body.error) {
    await db
      .from("proposal_assets")
      .update({ ocr_status: "failed", ocr_error: body.error, updated_at: new Date().toISOString() })
      .eq("id", body.asset_id);
    return NextResponse.json({ ok: true, status: "failed" });
  }

  // draft 允许不完全合法（毕竟是 OCR 草稿），但给出校验结果供校对页展示
  const validation = validateProposal(body.draft);
  const { error } = await db
    .from("proposal_assets")
    .update({
      ocr_status: "draft_ready",
      ocr_draft: body.draft ?? null,
      ocr_error: validation.ok ? null : `draft 未完全通过 schema 校验：${validation.errors?.join("; ")}`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.asset_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, status: "draft_ready", schema_valid: validation.ok });
}
