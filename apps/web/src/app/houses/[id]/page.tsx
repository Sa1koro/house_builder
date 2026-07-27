import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DEMO_HOUSE, DEMO_AES, DEMO_A5S, isSupabaseConfigured } from "@/lib/demo";
import { UploadAssetForm } from "@/components/UploadAssetForm";
import { DEMO_HOUSE_ID, DEMO_AES_ID, DEMO_A5S_ID } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HouseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let house = null;
  let proposals: Array<{ id: string; company: string; package_name: string; version: string | null; pricing: unknown }> = [];
  let user = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const houseRes = await supabase.from("houses").select("*").eq("id", id).single();
    house = houseRes.data;
    const propRes = await supabase
      .from("proposals")
      .select("id, company, package_name, version, pricing")
      .eq("house_id", id)
      .order("created_at");
    proposals = propRes.data ?? [];
    const userRes = await supabase.auth.getUser();
    user = userRes.data.user;
  }

  if (id === DEMO_HOUSE_ID && !house) {
    house = DEMO_HOUSE;
    proposals = [DEMO_AES, DEMO_A5S];
  }

  if (!house) notFound();
  const isOwner = user?.id === house.owner_id;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/houses" className="text-sm text-[var(--muted)]">
          ← 返回列表
        </Link>
        <h1 className="text-2xl font-bold mt-2">{house.name}</h1>
        <p className="text-[var(--muted)]">
          {house.city} · 售卖 {house.sales_area_sqm ?? "—"}㎡ · 计价{" "}
          {house.pricing_area_sqm}㎡ · {house.layout}
        </p>
        {house.is_public_demo && (
          <span className="badge badge-diff mt-2">公开 Demo</span>
        )}
      </div>

      <section className="card">
        <h2 className="font-semibold mb-3">方案列表</h2>
        {proposals && proposals.length >= 2 ? (
          <Link
            href={`/houses/${id}/compare?a=${proposals[0].id}&b=${proposals[1].id}`}
            className="btn btn-primary mb-4"
          >
            对比前两个方案
          </Link>
        ) : house.is_public_demo ? (
          <Link
            href={`/houses/${id}/compare?a=${DEMO_AES_ID}&b=${DEMO_A5S_ID}`}
            className="btn btn-primary mb-4"
          >
            对比 AEs vs A5s
          </Link>
        ) : null}
        <ul className="space-y-2">
          {(proposals ?? []).map((p) => (
            <li key={p.id} className="flex justify-between items-center py-2 border-b">
              <span>
                {p.company} · {p.package_name}
                {p.version && (
                  <span className="text-sm text-[var(--muted)]">
                    {" "}
                    ({p.version})
                  </span>
                )}
              </span>
            </li>
          ))}
          {(!proposals || proposals.length === 0) && (
            <p className="text-sm text-[var(--muted)]">暂无方案</p>
          )}
        </ul>
      </section>

      {isOwner && (
        <section className="card">
          <h2 className="font-semibold mb-3">上传方案原件</h2>
          <UploadAssetForm houseId={id} />
        </section>
      )}
    </div>
  );
}
