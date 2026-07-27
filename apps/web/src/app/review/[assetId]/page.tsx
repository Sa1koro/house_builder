"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface DraftData {
  company: string;
  packageName: string;
  pricing: Record<string, unknown>;
  lineItems: Array<{
    space: string;
    category: string;
    brands: string;
    notes?: string;
  }>;
  notes?: string[];
}

export default function ReviewPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const [assetId, setAssetId] = useState<string>("");
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [houseId, setHouseId] = useState<string>("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    params.then(({ assetId: id }) => {
      setAssetId(id);
      supabase
        .from("proposal_assets")
        .select("*, houses(id)")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) {
            setHouseId(data.house_id);
            setDraft(data.draft_json as DraftData);
          }
        });
    });
  }, [params, supabase]);

  async function handleConfirm() {
    if (!draft || !houseId) return;
    setStatus("保存中…");

    const { data: proposal, error } = await supabase
      .from("proposals")
      .insert({
        house_id: houseId,
        company: draft.company,
        package_name: draft.packageName,
        pricing: draft.pricing,
        notes: draft.notes ?? [],
      })
      .select("id")
      .single();

    if (error) {
      setStatus(error.message);
      return;
    }

    if (draft.lineItems?.length) {
      await supabase.from("proposal_line_items").insert(
        draft.lineItems.map((item, i) => ({
          proposal_id: proposal.id,
          space: item.space,
          category: item.category,
          brands: item.brands,
          notes: item.notes,
          sort_order: i,
        }))
      );
    }

    await supabase
      .from("proposal_assets")
      .update({ ocr_status: "reviewed", proposal_id: proposal.id })
      .eq("id", assetId);

    setStatus("已入库");
    router.push(`/houses/${houseId}`);
  }

  if (!draft) {
    return <p className="text-[var(--muted)]">加载草稿…</p>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">OCR 草稿校对</h1>
      <p className="text-sm text-[var(--muted)]">
        请核对 OCR 识别结果，确认后写入方案库。
      </p>

      <div className="card space-y-3">
        <div>
          <label className="text-sm">公司</label>
          <input
            value={draft.company}
            onChange={(e) =>
              setDraft({ ...draft, company: e.target.value })
            }
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm">套餐名</label>
          <input
            value={draft.packageName}
            onChange={(e) =>
              setDraft({ ...draft, packageName: e.target.value })
            }
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        {draft.notes?.map((note, i) => (
          <p key={i} className="text-xs text-[var(--muted)]">
            {note}
          </p>
        ))}
      </div>

      <button onClick={handleConfirm} className="btn btn-primary">
        确认入库
      </button>
      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}
