import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  const serviceKey = process.env.INGEST_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!token || token !== serviceKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { assetId, draft } = body as {
    assetId: string;
    draft: Record<string, unknown>;
  };

  if (!assetId || !draft) {
    return NextResponse.json(
      { error: "Missing assetId or draft" },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("proposal_assets")
    .update({
      draft_json: draft,
      ocr_status: "draft_ready",
    })
    .eq("id", assetId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, asset: data });
}
