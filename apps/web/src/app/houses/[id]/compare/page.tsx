import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatCurrency, type PricingJson, DEMO_HOUSE_ID } from "@/lib/utils";
import { TermHint } from "@/components/TermHint";
import { CompareExport } from "@/components/CompareExport";
import {
  DEMO_HOUSE,
  DEMO_AES,
  DEMO_A5S,
  DEMO_LINE_ITEMS_AES,
  DEMO_LINE_ITEMS_A5S,
  isSupabaseConfigured,
} from "@/lib/demo";

export const dynamic = "force-dynamic";

interface LineItem {
  id: string;
  space: string;
  category: string;
  brands: string;
  notes: string | null;
  term_slugs: string[] | null;
}

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { id: houseId } = await params;
  const { a: proposalAId, b: proposalBId } = await searchParams;

  if (!proposalAId || !proposalBId) notFound();

  const supabase = isSupabaseConfigured() ? await createClient() : null;

  let house = null;
  let propA = null;
  let propB = null;
  let itemsA: LineItem[] = [];
  let itemsB: LineItem[] = [];

  if (supabase) {
    const houseRes = await supabase.from("houses").select("*").eq("id", houseId).single();
    house = houseRes.data;

    const [aRes, bRes] = await Promise.all([
      supabase.from("proposals").select("*").eq("id", proposalAId).single(),
      supabase.from("proposals").select("*").eq("id", proposalBId).single(),
    ]);
    propA = aRes.data;
    propB = bRes.data;

    const [iaRes, ibRes] = await Promise.all([
      supabase.from("proposal_line_items").select("*").eq("proposal_id", proposalAId).order("sort_order"),
      supabase.from("proposal_line_items").select("*").eq("proposal_id", proposalBId).order("sort_order"),
    ]);
    itemsA = iaRes.data ?? [];
    itemsB = ibRes.data ?? [];
  }

  if (houseId === DEMO_HOUSE_ID && (!house || !propA || !propB)) {
    house = DEMO_HOUSE;
    propA = proposalAId === DEMO_AES.id ? DEMO_AES : propA;
    propB = proposalBId === DEMO_A5S.id ? DEMO_A5S : propB;
    if (!propA) propA = DEMO_AES;
    if (!propB) propB = DEMO_A5S;
    if (itemsA.length === 0) itemsA = DEMO_LINE_ITEMS_AES as LineItem[];
    if (itemsB.length === 0) itemsB = DEMO_LINE_ITEMS_A5S as LineItem[];
  }

  if (!house || !propA || !propB) notFound();

  const pricingA = propA.pricing as PricingJson;
  const pricingB = propB.pricing as PricingJson;

  const diffParticle =
    (pricingB.totals?.withFeesParticle ?? 0) -
    (pricingA.totals?.withFeesParticle ?? 0);
  const diffBase =
    (pricingB.totals?.baseParticle ?? 0) -
    (pricingA.totals?.baseParticle ?? 0);

  const allItems = mergeLineItems(itemsA, itemsB);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/houses/${houseId}`}
          className="text-sm text-[var(--muted)]"
        >
          ← {house.name}
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          {propA.package_name} vs {propB.package_name}
        </h1>
        <p className="text-[var(--muted)]">
          计价面积 {house.pricing_area_sqm}㎡ · {propA.company}
        </p>
      </div>

      <section className="card">
        <h2 className="font-semibold mb-4">总价对比（颗粒板 · 含管理费）</h2>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg badge-aes">
            <div className="text-sm font-medium">{propA.package_name}</div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(pricingA.totals?.withFeesParticle ?? 0)}
            </div>
            <div className="text-xs mt-1 text-gray-600">
              基础价{" "}
              {formatCurrency(pricingA.totals?.baseParticle ?? 0)}
            </div>
          </div>
          <div className="p-4 rounded-lg badge-diff flex flex-col justify-center">
            <div className="text-sm">差额 (B − A)</div>
            <div className="text-2xl font-bold">
              +{formatCurrency(diffParticle)}
            </div>
            <div className="text-xs mt-1">
              基础价差 {formatCurrency(diffBase)}
            </div>
          </div>
          <div className="p-4 rounded-lg badge-a5s">
            <div className="text-sm font-medium">{propB.package_name}</div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(pricingB.totals?.withFeesParticle ?? 0)}
            </div>
            <div className="text-xs mt-1 text-gray-600">
              基础价{" "}
              {formatCurrency(pricingB.totals?.baseParticle ?? 0)}
            </div>
          </div>
        </div>

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-[var(--primary)]">
            费用拆解
          </summary>
          <table className="w-full mt-2 text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">项目</th>
                <th>{propA.package_name}</th>
                <th>{propB.package_name}</th>
              </tr>
            </thead>
            <tbody>
              <PriceRow
                label="硬装基础价"
                a={pricingA.hardBase}
                b={pricingB.hardBase}
              />
              <PriceRow
                label="超面积费用"
                a={pricingA.areaOverage?.amount}
                b={pricingB.areaOverage?.amount}
              />
              <PriceRow
                label={
                  <TermHint slug="custom-board-particle">定制(颗粒板)</TermHint>
                }
                a={pricingA.customBoard?.particle}
                b={pricingB.customBoard?.particle}
              />
              <PriceRow
                label={
                  <TermHint slug="management-fee">工程管理费</TermHint>
                }
                a={pricingA.managementFee}
                b={pricingB.managementFee}
              />
              <PriceRow
                label={
                  <TermHint slug="project-manager-fee">项目经理费</TermHint>
                }
                a={pricingA.projectManagerFee}
                b={pricingB.projectManagerFee}
              />
            </tbody>
          </table>
        </details>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="font-semibold mb-4">配置差异</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4">空间</th>
              <th className="py-2 pr-4">品类</th>
              <th className="py-2 pr-4 badge-aes">{propA.package_name}</th>
              <th className="py-2 pr-4 badge-a5s">{propB.package_name}</th>
              <th className="py-2">差异</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map((row, i) => (
              <tr
                key={i}
                className={`border-b ${row.isDiff ? "bg-[#fff8e1]" : ""}`}
              >
                <td className="py-2 pr-4">{row.space}</td>
                <td className="py-2 pr-4">
                  {row.termSlug ? (
                    <TermHint slug={row.termSlug}>{row.category}</TermHint>
                  ) : (
                    row.category
                  )}
                </td>
                <td className="py-2 pr-4">{row.brandsA ?? "—"}</td>
                <td className="py-2 pr-4">{row.brandsB ?? "—"}</td>
                <td className="py-2 text-xs">{row.diffNote ?? (row.isDiff ? "不同" : "相同")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <CompareExport
        house={house}
        propA={propA}
        propB={propB}
        pricingA={pricingA}
        pricingB={pricingB}
        diffParticle={diffParticle}
      />
    </div>
  );
}

function PriceRow({
  label,
  a,
  b,
}: {
  label: React.ReactNode;
  a?: number;
  b?: number;
}) {
  return (
    <tr className="border-b">
      <td className="py-2">{label}</td>
      <td>{a != null ? formatCurrency(a) : "—"}</td>
      <td>{b != null ? formatCurrency(b) : "—"}</td>
    </tr>
  );
}

function mergeLineItems(a: LineItem[], b: LineItem[]) {
  const keys = new Set<string>();
  const mapA = new Map<string, LineItem>();
  const mapB = new Map<string, LineItem>();

  for (const item of a) {
    const key = `${item.space}::${item.category}`;
    keys.add(key);
    mapA.set(key, item);
  }
  for (const item of b) {
    const key = `${item.space}::${item.category}`;
    keys.add(key);
    mapB.set(key, item);
  }

  return Array.from(keys).map((key) => {
    const [space, category] = key.split("::");
    const ia = mapA.get(key);
    const ib = mapB.get(key);
    const brandsA = ia?.brands;
    const brandsB = ib?.brands;
    const isDiff = brandsA !== brandsB;
    const termSlug =
      ia?.term_slugs?.[0] ?? ib?.term_slugs?.[0] ?? undefined;
    return {
      space,
      category,
      brandsA,
      brandsB,
      isDiff,
      termSlug,
      diffNote: ib?.notes ?? ia?.notes ?? undefined,
    };
  });
}
