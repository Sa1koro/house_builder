import { NextResponse } from "next/server";
import { getLocalStore } from "@/lib/local-store";
import { createServiceClient } from "@/lib/supabase/admin";

function authorized(request: Request) {
  const secret = process.env.INGEST_API_SECRET || "dev-ingest-secret";
  return request.headers.get("x-ingest-secret") === secret;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const draft = await request.json();
  const store = getLocalStore();
  store.drafts.unshift(draft);

  const admin = createServiceClient();
  if (admin && draft.asset_id) {
    await admin
      .from("proposal_assets")
      .update({
        ocr_status: "draft",
        ocr_draft: draft,
        updated_at: new Date().toISOString(),
      })
      .eq("id", draft.asset_id);
  }

  return NextResponse.json({ ok: true, queued: store.drafts.length });
}

export async function GET() {
  const drafts = getLocalStore().drafts;
  return NextResponse.json({ drafts });
}
