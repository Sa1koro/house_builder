import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { HouseRow, LineItemRow, ProposalRow, TermRow } from "@/lib/types";
import { fmtCNY, fmtDiff } from "@/lib/format";
import { TermHint } from "@/components/TermHint";
import { CopyButton } from "@/components/CopyButton";
import { buildCompareMarkdown } from "./markdown";

interface DiffRow {
  space: string;
  category: string;
  a: LineItemRow | null;
  b: LineItemRow | null;
  same: boolean;
  aExtra: string[];
  bExtra: string[];
  termSlugs: string[];
}

function buildDiffRows(aItems: LineItemRow[], bItems: LineItemRow[]): DiffRow[] {
  const key = (li: LineItemRow) => `${li.space}|${li.category}`;
  const bMap = new Map(bItems.map((li) => [key(li), li]));
  const seen = new Set<string>();
  const rows: DiffRow[] = [];

  const push = (a: LineItemRow | null, b: LineItemRow | null) => {
    const aSet = new Set(a?.brand_names ?? []);
    const bSet = new Set(b?.brand_names ?? []);
    const aExtra = [...aSet].filter((x) => !bSet.has(x));
    const bExtra = [...bSet].filter((x) => !aSet.has(x));
    const same =
      Boolean(a && b) &&
      aExtra.length === 0 &&
      bExtra.length === 0 &&
      (a?.spec ?? "") === (b?.spec ?? "") &&
      (a?.note ?? "") === (b?.note ?? "");
    rows.push({
      space: (a ?? b)!.space,
      category: (a ?? b)!.category,
      a,
      b,
      same,
      aExtra,
      bExtra,
      termSlugs: [...new Set([...(a?.term_slugs ?? []), ...(b?.term_slugs ?? [])])],
    });
  };

  for (const a of aItems) {
    const k = key(a);
    seen.add(k);
    push(a, bMap.get(k) ?? null);
  }
  for (const b of bItems) {
    if (!seen.has(key(b))) push(null, b);
  }
  return rows;
}

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { id } = await params;
  const { a: aId, b: bId } = await searchParams;
  const supabase = await createClient();

  const { data: houseData } = await supabase.from("houses").select("*").eq("id", id).maybeSingle();
  if (!houseData) notFound();
  const house = houseData as HouseRow;

  const { data: proposalsData } = await supabase
    .from("proposals")
    .select("*")
    .eq("house_id", id)
    .order("created_at");
  const proposals = (proposalsData ?? []) as ProposalRow[];
  const a = proposals.find((p) => p.id === aId) ?? proposals[0];
  const b = proposals.find((p) => p.id === bId) ?? proposals.find((p) => p.id !== a?.id);

  if (!a || !b) {
    return (
      <div className="py-16 text-center text-sm text-stone-500">
        该房屋不足两份方案，无法对比。
        <Link href={`/houses/${id}`} className="ml-1 text-emerald-700 hover:underline">
          返回房屋 →
        </Link>
      </div>
    );
  }

  const [{ data: aItemsData }, { data: bItemsData }] = await Promise.all([
    supabase.from("proposal_line_items").select("*").eq("proposal_id", a.id).order("position"),
    supabase.from("proposal_line_items").select("*").eq("proposal_id", b.id).order("position"),
  ]);
  const aItems = (aItemsData ?? []) as LineItemRow[];
  const bItems = (bItemsData ?? []) as LineItemRow[];
  const diffRows = buildDiffRows(aItems, bItems);

  const allSlugs = [...new Set(diffRows.flatMap((r) => r.termSlugs))];
  const { data: termsData } = allSlugs.length
    ? await supabase.from("terms").select("*").in("slug", allSlugs)
    : { data: [] };
  const termMap = new Map(((termsData ?? []) as TermRow[]).map((t) => [t.slug, t]));

  // 价格拆解：按 A 的 items 顺序取并集
  const aPricing = a.pricing?.items ?? [];
  const bPricing = b.pricing?.items ?? [];
  const bPriceMap = new Map(bPricing.map((i) => [i.key, i]));
  const priceKeys = [
    ...aPricing.map((i) => i.key),
    ...bPricing.filter((i) => !aPricing.some((x) => x.key === i.key)).map((i) => i.key),
  ];
  const aPriceMap = new Map(aPricing.map((i) => [i.key, i]));

  const markdown = buildCompareMarkdown(house, a, b, diffRows, termMap);
  const jsonExport = JSON.stringify(
    {
      house: { name: house.name, sales_area_sqm: house.sales_area_sqm, billing_area_sqm: house.billing_area_sqm },
      proposals: [
        { ...a, line_items: aItems },
        { ...b, line_items: bItems },
      ],
    },
    null,
    2
  );

  const diffCount = diffRows.filter((r) => !r.same).length;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500">
            <Link href={`/houses/${house.id}`} className="hover:text-emerald-700 hover:underline">
              {house.name}
            </Link>
            {" · 计价面积 "}
            {house.billing_area_sqm ?? "—"}㎡
          </p>
          <h1 className="mt-1 text-2xl font-bold text-stone-900">
            <span className="text-emerald-700">{a.package_name}</span>
            <span className="mx-2 text-stone-300">vs</span>
            <span className="text-sky-700">{b.package_name}</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <CopyButton text={markdown} label="复制 Markdown 给 AI" />
          <CopyButton text={jsonExport} label="复制 JSON" />
        </div>
      </div>

      {/* 总价拆解 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-stone-900">总价拆解</h2>
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-500">
                <th className="px-4 py-3">项目</th>
                <th className="bg-emerald-50/60 px-4 py-3 text-right">{a.package_name}</th>
                <th className="bg-sky-50/60 px-4 py-3 text-right">{b.package_name}</th>
                <th className="px-4 py-3 text-right">差额（B−A）</th>
                <th className="hidden px-4 py-3 sm:table-cell">说明</th>
              </tr>
            </thead>
            <tbody>
              {priceKeys.map((k) => {
                const ia = aPriceMap.get(k);
                const ib = bPriceMap.get(k);
                const diff = (ib?.amount ?? 0) - (ia?.amount ?? 0);
                return (
                  <tr key={k} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-2.5">{ia?.label ?? ib?.label ?? k}</td>
                    <td className="bg-emerald-50/40 px-4 py-2.5 text-right tabular-nums">{fmtCNY(ia?.amount)}</td>
                    <td className="bg-sky-50/40 px-4 py-2.5 text-right tabular-nums">{fmtCNY(ib?.amount)}</td>
                    <td className={`px-4 py-2.5 text-right tabular-nums ${diff > 0 ? "text-amber-700" : diff < 0 ? "text-emerald-700" : "text-stone-400"}`}>
                      {fmtDiff(diff)}
                    </td>
                    <td className="hidden px-4 py-2.5 text-xs text-stone-400 sm:table-cell">{ia?.note ?? ib?.note ?? ""}</td>
                  </tr>
                );
              })}
              <tr className="border-b border-stone-100 bg-stone-50 font-semibold">
                <td className="px-4 py-3">全案基础价（不含管理费）</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtCNY(a.total_base)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtCNY(b.total_base)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-amber-700">
                  {fmtDiff((b.total_base ?? 0) - (a.total_base ?? 0))}
                </td>
                <td className="hidden sm:table-cell" />
              </tr>
              <tr className="bg-stone-50 font-semibold">
                <td className="px-4 py-3">含费预估</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtCNY(a.total_with_fees)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmtCNY(b.total_with_fees)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-amber-700">
                  {fmtDiff((b.total_with_fees ?? 0) - (a.total_with_fees ?? 0))}
                </td>
                <td className="hidden sm:table-cell" />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 配置差异 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-900">配置对比</h2>
          <p className="text-sm text-stone-500">
            共 {diffRows.length} 项，其中 <span className="font-semibold text-amber-700">{diffCount} 项有差异</span>
            ；名词可悬停看释义
          </p>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs uppercase tracking-wide text-stone-500">
                <th className="px-4 py-3">空间</th>
                <th className="px-4 py-3">品类 / 名词</th>
                <th className="bg-emerald-50/60 px-4 py-3">{a.package_name}</th>
                <th className="bg-sky-50/60 px-4 py-3">{b.package_name}</th>
                <th className="px-4 py-3">差异</th>
              </tr>
            </thead>
            <tbody>
              {diffRows.map((r, i) => (
                <tr
                  key={`${r.space}-${r.category}-${i}`}
                  className={`border-b border-stone-100 align-top last:border-0 ${r.same ? "" : "bg-amber-50/40"}`}
                >
                  <td className="whitespace-nowrap px-4 py-2.5 text-stone-500">{r.space}</td>
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-stone-800">{r.category}</span>
                    {r.termSlugs.length > 0 && (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {r.termSlugs.map((slug) => {
                          const t = termMap.get(slug);
                          return t ? <TermHint key={slug} term={t} /> : null;
                        })}
                      </span>
                    )}
                  </td>
                  <CellContent li={r.a} highlight={r.aExtra} tone="emerald" />
                  <CellContent li={r.b} highlight={r.bExtra} tone="sky" />
                  <td className="px-4 py-2.5 text-xs">
                    {r.same ? (
                      <span className="text-stone-400">相同</span>
                    ) : (
                      <span className="font-medium text-amber-700">
                        {r.bExtra.length > 0 && `B 多：${r.bExtra.join("、")}`}
                        {r.bExtra.length > 0 && r.aExtra.length > 0 && "；"}
                        {r.aExtra.length > 0 && `A 多：${r.aExtra.join("、")}`}
                        {r.aExtra.length === 0 && r.bExtra.length === 0 && "细节不同"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 备注 */}
      {(a.notes.length > 0 || b.notes.length > 0) && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          <h2 className="font-semibold">注意事项</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {[...new Set([...a.notes, ...b.notes])].map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function CellContent({
  li,
  highlight,
  tone,
}: {
  li: LineItemRow | null;
  highlight: string[];
  tone: "emerald" | "sky";
}) {
  const bg = tone === "emerald" ? "bg-emerald-50/40" : "bg-sky-50/40";
  const hl = tone === "emerald" ? "bg-emerald-200/70 font-semibold" : "bg-sky-200/70 font-semibold";
  if (!li) return <td className={`px-4 py-2.5 text-stone-300 ${bg}`}>—</td>;
  return (
    <td className={`px-4 py-2.5 ${bg}`}>
      {li.brand_names.length > 0 ? (
        <span className="flex flex-wrap gap-1">
          {li.brand_names.map((n) => (
            <span key={n} className={`rounded px-1.5 py-0.5 text-xs ${highlight.includes(n) ? hl : "bg-white/70 text-stone-700"}`}>
              {n}
            </span>
          ))}
        </span>
      ) : (
        <span className="text-xs text-stone-500">{li.spec ?? li.note ?? "—"}</span>
      )}
      {li.brand_names.length > 0 && (li.spec || li.note) && (
        <span className="mt-1 block text-xs text-stone-400">{[li.spec, li.note].filter(Boolean).join(" · ")}</span>
      )}
    </td>
  );
}
