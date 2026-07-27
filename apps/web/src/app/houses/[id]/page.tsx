import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import type { AssetRow, HouseRow, ProposalRow } from "@/lib/types";
import { fmtCNY, OCR_STATUS_LABELS } from "@/lib/format";
import { UploadAsset } from "@/components/UploadAsset";
import { deleteHouse } from "../actions";

export default async function HouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getUser();

  const { data: houseData } = await supabase.from("houses").select("*").eq("id", id).maybeSingle();
  if (!houseData) notFound(); // RLS：别人的私有房查不到
  const house = houseData as HouseRow;
  const isOwner = Boolean(user && house.owner_id === user.id);

  const [{ data: proposalsData }, { data: assetsData }] = await Promise.all([
    supabase.from("proposals").select("*").eq("house_id", id).order("created_at"),
    isOwner
      ? supabase.from("proposal_assets").select("*").eq("house_id", id).order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as AssetRow[] }),
  ]);
  const proposals = (proposalsData ?? []) as ProposalRow[];
  const assets = (assetsData ?? []) as AssetRow[];

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-stone-900">{house.name}</h1>
            {house.is_public_demo && (
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">公开示例</span>
            )}
          </div>
          <p className="mt-1 text-sm text-stone-500">
            {[house.city, house.layout].filter(Boolean).join(" · ")} · 售卖 {house.sales_area_sqm ?? "—"}㎡ · 计价{" "}
            {house.billing_area_sqm ?? "—"}㎡
          </p>
        </div>
        {isOwner && (
          <form action={deleteHouse}>
            <input type="hidden" name="id" value={house.id} />
            <button className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
              删除房屋
            </button>
          </form>
        )}
      </div>

      {/* 方案列表 + 对比入口 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">方案（{proposals.length}）</h2>
        {proposals.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-6 text-sm text-stone-500">
            还没有方案。上传原件后由 OCR 解析生成草稿，校对确认即可入库。
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-500">
                  <th className="px-4 py-3">公司 / 套餐</th>
                  <th className="px-4 py-3">版本</th>
                  <th className="px-4 py-3 text-right">基础价</th>
                  <th className="px-4 py-3 text-right">含费预估</th>
                  <th className="px-4 py-3">来源</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr key={p.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {p.company} · {p.package_name}
                    </td>
                    <td className="px-4 py-3 text-stone-500">{p.version ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtCNY(p.total_base)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtCNY(p.total_with_fees)}</td>
                    <td className="px-4 py-3 text-stone-500">{p.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {proposals.length >= 2 && (
          <form action={`/houses/${house.id}/compare`} method="get" className="flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-xs text-stone-500">方案 A</span>
              <select name="a" defaultValue={proposals[0].id} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.company} {p.package_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-stone-500">方案 B</span>
              <select name="b" defaultValue={proposals[1].id} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.company} {p.package_name}
                  </option>
                ))}
              </select>
            </label>
            <button className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              开始对比 →
            </button>
          </form>
        )}
      </section>

      {/* 原件与 OCR */}
      {isOwner && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-stone-900">方案原件（Vercel Blob）</h2>
          <UploadAsset houseId={house.id} />
          {assets.length > 0 && (
            <ul className="space-y-2">
              {assets.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm shadow-sm"
                >
                  <div className="min-w-0">
                    <a
                      href={a.blob_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate font-medium text-emerald-700 hover:underline"
                    >
                      {a.pathname?.split("/").pop() ?? a.blob_url}
                    </a>
                    <p className="mt-0.5 text-xs text-stone-400">
                      {a.mime ?? "unknown"} · asset_id: <code className="select-all">{a.id}</code>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={a.ocr_status} />
                    {a.ocr_status === "draft_ready" && (
                      <Link
                        href={`/houses/${house.id}/assets/${a.id}/review`}
                        className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600"
                      >
                        去校对入库 →
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs leading-5 text-stone-500">
            <p className="font-medium text-stone-600">OCR 不在云端跑（见 packages/ingest）。上传后在本机执行：</p>
            <pre className="mt-2 overflow-x-auto rounded bg-stone-900 p-3 text-stone-100">
              {`cd packages/ingest
python -m ingest.worker --asset-id <上面的 asset_id> --push`}
            </pre>
            <p className="mt-2">worker 会下载 Blob → 本地 OCR → 推回 draft，然后回到这里点「去校对入库」。</p>
          </div>
        </section>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-stone-100 text-stone-600",
    processing: "bg-sky-100 text-sky-700",
    draft_ready: "bg-amber-100 text-amber-700",
    reviewed: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.pending}`}>
      {OCR_STATUS_LABELS[status] ?? status}
    </span>
  );
}
