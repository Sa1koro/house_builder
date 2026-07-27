"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateProposal } from "@house-builder/schema";
import { createClient } from "@/lib/supabase/server";

/** 校对确认：把（人工修订后的）draft 写入 proposals + line items，asset 标记 reviewed。 */
export async function confirmDraft(formData: FormData) {
  const houseId = String(formData.get("house_id") ?? "");
  const assetId = String(formData.get("asset_id") ?? "");
  const back = `/houses/${houseId}/assets/${assetId}/review`;

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("draft") ?? ""));
  } catch {
    redirect(`${back}?error=${encodeURIComponent("JSON 语法错误，请检查后重试")}`);
  }

  const validation = validateProposal(parsed);
  if (!validation.ok || !validation.data) {
    redirect(`${back}?error=${encodeURIComponent(`未通过 schema 校验：${validation.errors?.slice(0, 5).join("；")}`)}`);
  }
  const draft = validation.data!;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: proposal, error: pErr } = await supabase
    .from("proposals")
    .insert({
      house_id: houseId,
      company: draft.company,
      package_name: draft.package_name,
      version: draft.version ?? null,
      status: "confirmed",
      source: "ocr",
      pricing: draft.pricing,
      total_base: draft.pricing.total_base ?? null,
      total_with_fees: draft.pricing.total_with_fees ?? null,
      notes: draft.notes ?? [],
    })
    .select("id")
    .single();
  if (pErr || !proposal) redirect(`${back}?error=${encodeURIComponent(pErr?.message ?? "写入失败")}`);

  const items = draft.line_items.map((li, i) => ({
    proposal_id: proposal!.id,
    position: i,
    space: li.space,
    category: li.category,
    brand_names: li.brands ?? [],
    spec: li.spec ?? null,
    note: li.note ?? null,
    term_slugs: li.term_slugs ?? [],
  }));
  if (items.length > 0) {
    const { error: liErr } = await supabase.from("proposal_line_items").insert(items);
    if (liErr) redirect(`${back}?error=${encodeURIComponent(`明细写入失败：${liErr.message}`)}`);
  }

  await supabase
    .from("proposal_assets")
    .update({ ocr_status: "reviewed", proposal_id: proposal!.id, updated_at: new Date().toISOString() })
    .eq("id", assetId);

  revalidatePath(`/houses/${houseId}`);
  redirect(`/houses/${houseId}`);
}
