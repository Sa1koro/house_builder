import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import type { AssetRow } from "@/lib/types";
import { OCR_STATUS_LABELS } from "@/lib/format";
import { confirmDraft } from "./actions";

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; assetId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id, assetId } = await params;
  const { error } = await searchParams;
  const user = await getUser().catch(() => null);
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase.from("proposal_assets").select("*").eq("id", assetId).maybeSingle();
  if (!data) notFound();
  const asset = data as AssetRow;

  const draftText = asset.ocr_draft ? JSON.stringify(asset.ocr_draft, null, 2) : "";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-stone-500">
          <Link href={`/houses/${id}`} className="hover:text-emerald-700 hover:underline">
            ← 返回房屋
          </Link>
        </p>
        <h1 className="mt-1 text-2xl font-bold text-stone-900">OCR 草稿校对</h1>
        <p className="mt-1 text-sm text-stone-500">
          状态：{OCR_STATUS_LABELS[asset.ocr_status] ?? asset.ocr_status} · 原件：
          <a href={asset.blob_url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
            在新窗口打开对照 ↗
          </a>
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      {asset.ocr_error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          worker 提示：{asset.ocr_error}
        </p>
      )}

      {asset.ocr_status === "pending" || asset.ocr_status === "processing" ? (
        <div className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
          草稿还没生成。请在本机运行 OCR worker（见 packages/ingest/README.md）：
          <pre className="mx-auto mt-3 max-w-md overflow-x-auto rounded bg-stone-900 p-3 text-left text-xs text-stone-100">
            {`python -m ingest.worker --asset-id ${asset.id} --push`}
          </pre>
        </div>
      ) : (
        <form action={confirmDraft} className="space-y-4">
          <input type="hidden" name="house_id" value={id} />
          <input type="hidden" name="asset_id" value={asset.id} />
          <p className="text-sm text-stone-600">
            对照原件核对下方 JSON（结构见 <code>packages/schema/schemas/proposal.schema.json</code>），改完点确认即写入方案库。
          </p>
          <textarea
            name="draft"
            defaultValue={draftText}
            rows={28}
            spellCheck={false}
            className="w-full rounded-xl border border-stone-300 bg-stone-950 p-4 font-mono text-xs leading-5 text-stone-100 outline-none focus:border-emerald-500"
          />
          <div className="flex items-center gap-3">
            <button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              校对无误，确认入库
            </button>
            <span className="text-xs text-stone-400">入库前会再次做 JSON Schema 校验</span>
          </div>
        </form>
      )}
    </div>
  );
}
