import { NextResponse } from "next/server";
import { z } from "zod";
import { proposalDraftSchema } from "@/lib/proposal-schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const confirmSchema = z.object({ assetId: z.string().uuid(), draft: proposalDraftSchema });

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  try {
    const { assetId, draft } = confirmSchema.parse(await request.json());
    const { data: asset } = await supabase.from("proposal_assets").select("id,house_id,owner_id").eq("id", assetId).eq("owner_id", user.id).single();
    if (!asset) return NextResponse.json({ error: "原件不存在或无权访问" }, { status: 403 });
    const { data: proposal, error } = await supabase.from("proposals").insert({
      house_id: asset.house_id,
      company: draft.company,
      package_name: draft.packageName,
      version: draft.version,
      currency: draft.currency,
      costs: draft.costs,
      status: "confirmed",
    }).select("id").single();
    if (error) throw error;
    if (draft.lineItems.length) {
      const { error: lineError } = await supabase.from("proposal_line_items").insert(draft.lineItems.map((item, sortOrder) => ({
        proposal_id: proposal.id,
        sort_order: sortOrder,
        space: item.space,
        category: item.category,
        specification: item.specification,
        brands: item.brands,
        term_slugs: item.termSlugs ?? [],
        notes: item.notes,
      })));
      if (lineError) throw lineError;
    }
    await supabase.from("proposal_assets").update({ proposal_id: proposal.id, ocr_draft: draft, ocr_status: "confirmed" }).eq("id", assetId);
    return NextResponse.json({ proposalId: proposal.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "确认失败" }, { status: 400 });
  }
}
