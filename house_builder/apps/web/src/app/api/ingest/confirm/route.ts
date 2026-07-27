import { NextResponse } from "next/server";
import { ProposalSchema } from "@house-builder/schema";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { getLocalStore } from "@/lib/local-store";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = ProposalSchema.safeParse(body.proposal);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid proposal", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const proposal = parsed.data;

  const supabase = await createClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  const admin = createServiceClient();
  if (admin && user && proposal.house_id) {
    const { data, error } = await admin
      .from("proposals")
      .insert({
        house_id: proposal.house_id,
        owner_id: user.id,
        company: proposal.company,
        package_name: proposal.package_name,
        version: proposal.version ?? "1.0",
        billing_area_sqm: proposal.billing_area_sqm,
        sales_area_sqm: proposal.sales_area_sqm,
        costs: proposal.costs,
        notes: proposal.notes ?? [],
        source: "ocr_review",
        is_public_demo: false,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (proposal.line_items?.length) {
      await admin.from("proposal_line_items").insert(
        proposal.line_items.map((li, i) => ({
          proposal_id: data.id,
          space: li.space,
          category: li.category,
          spec: li.spec,
          brands: li.brands ?? [],
          term_slugs: li.term_slugs ?? [],
          qty: li.qty,
          unit: li.unit,
          amount: li.amount,
          notes: li.notes,
          sort_order: i + 1,
        })),
      );
    }

    if (body.asset_id) {
      await admin
        .from("proposal_assets")
        .update({
          ocr_status: "reviewed",
          proposal_id: data.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", body.asset_id);
    }

    return NextResponse.json({ id: data.id, proposal: data });
  }

  // Local fallback: keep confirmed draft in memory store
  const id = crypto.randomUUID();
  const store = getLocalStore();
  store.proposals.push({
    id,
    house_id: proposal.house_id || store.houses[0].id,
    company: proposal.company,
    package_name: proposal.package_name,
    version: proposal.version,
    billing_area_sqm: proposal.billing_area_sqm,
    sales_area_sqm: proposal.sales_area_sqm,
    costs: proposal.costs as Record<string, number | string>,
    notes: proposal.notes,
    source: "ocr_review",
    line_items: proposal.line_items,
  });

  return NextResponse.json({
    id,
    mode: "local",
    message: user
      ? "已写入本地内存（缺少 service role / house_id 时）"
      : "未登录：已写入本地内存演示存储",
  });
}
