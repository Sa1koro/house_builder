import { NextResponse } from "next/server";
import { z } from "zod";
import { proposalDraftSchema } from "@/lib/proposal-schema";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const payloadSchema = z.object({ assetId: z.string().uuid(), draft: proposalDraftSchema });

export async function POST(request: Request) {
  const expectedToken = process.env.INGEST_API_TOKEN;
  if (!expectedToken || request.headers.get("authorization") !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "无效的 worker token" }, { status: 401 });
  }
  try {
    const payload = payloadSchema.parse(await request.json());
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.from("proposal_assets").update({
      ocr_draft: payload.draft,
      ocr_status: "review",
    }).eq("id", payload.assetId).select("id,house_id,ocr_status").single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "草稿格式错误" }, { status: 400 });
  }
}
