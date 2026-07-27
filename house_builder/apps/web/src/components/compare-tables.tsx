import type { ProposalRecord } from "@/lib/local-store";
import { formatMoney } from "@/lib/data";
import type { Term } from "@house-builder/schema";
import { TermHint } from "@/components/term-hint";

const COST_ROWS: Array<{ key: string; label: string; term?: string }> = [
  { key: "hard_base", label: "硬装基础价", term: "hard-fitout" },
  { key: "overage_unit", label: "超面积单价" },
  { key: "overage_area", label: "超出面积(㎡)" },
  { key: "overage_fee", label: "超面积费用", term: "overage-fee" },
  { key: "hard_subtotal", label: "硬装小计", term: "hard-fitout" },
  { key: "custom_particle", label: "定制-颗粒板", term: "particle-board" },
  { key: "custom_solid", label: "定制-实木芯", term: "solid-core" },
  { key: "base_particle", label: "全案基础价(颗粒板)", term: "base-package-price" },
  { key: "base_solid", label: "全案基础价(实木芯)", term: "base-package-price" },
  { key: "mgmt_fee", label: "工程管理费", term: "mgmt-fee" },
  { key: "pm_fee", label: "项目经理费", term: "pm-fee" },
  { key: "total_particle", label: "含费预估(颗粒板)" },
  { key: "total_solid", label: "含费预估(实木芯)" },
];

function num(v: number | string | undefined) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  return 0;
}

export function CompareCosts({
  a,
  b,
  terms,
}: {
  a: ProposalRecord;
  b: ProposalRecord;
  terms: Record<string, Term>;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white/70">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--sage-deep)] text-white">
          <tr>
            <th className="px-4 py-3 font-medium">项目</th>
            <th className="px-4 py-3 font-medium">{a.package_name}</th>
            <th className="px-4 py-3 font-medium">{b.package_name}</th>
            <th className="px-4 py-3 font-medium">差额</th>
          </tr>
        </thead>
        <tbody>
          {COST_ROWS.map((row) => {
            const av = num(a.costs[row.key]);
            const bv = num(b.costs[row.key]);
            const diff = bv - av;
            const term = row.term ? terms[row.term] : undefined;
            return (
              <tr key={row.key} className="border-t border-[var(--line)]">
                <td className="px-4 py-2.5">
                  {term ? (
                    <TermHint slug={row.term!} label={row.label} term={term} />
                  ) : (
                    row.label
                  )}
                </td>
                <td className="px-4 py-2.5 bg-[#eef6f0]">
                  {row.key.includes("area") && !row.key.includes("fee")
                    ? av
                    : formatMoney(av)}
                </td>
                <td className="px-4 py-2.5 bg-[#e8f0f7]">
                  {row.key.includes("area") && !row.key.includes("fee")
                    ? bv
                    : formatMoney(bv)}
                </td>
                <td className="px-4 py-2.5 bg-[#fff8e8]">
                  {row.key.includes("area") && !row.key.includes("fee")
                    ? diff
                    : formatMoney(diff)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CompareLineItems({
  a,
  b,
  terms,
}: {
  a: ProposalRecord;
  b: ProposalRecord;
  terms: Record<string, Term>;
}) {
  const mapB = new Map(
    b.line_items.map((i) => [`${i.space}::${i.category}`, i]),
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white/70">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--sage-deep)] text-white">
          <tr>
            <th className="px-4 py-3">空间</th>
            <th className="px-4 py-3">品类</th>
            <th className="px-4 py-3">{a.package_name}</th>
            <th className="px-4 py-3">{b.package_name}</th>
            <th className="px-4 py-3">差异</th>
          </tr>
        </thead>
        <tbody>
          {a.line_items.map((item) => {
            const other = mapB.get(`${item.space}::${item.category}`);
            const same = other?.spec === item.spec;
            const slugs = Array.from(
              new Set([...(item.term_slugs ?? []), ...(other?.term_slugs ?? [])]),
            );
            return (
              <tr key={`${item.space}-${item.category}`} className="border-t border-[var(--line)] align-top">
                <td className="px-4 py-2.5 whitespace-nowrap">{item.space}</td>
                <td className="px-4 py-2.5">
                  {item.category}
                  {slugs.length ? (
                    <span className="mt-1 flex flex-wrap gap-2">
                      {slugs.map((s) => (
                        <TermHint key={s} slug={s} term={terms[s]} label={terms[s]?.name ?? s} />
                      ))}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-2.5 bg-[#eef6f0]">{item.spec}</td>
                <td className="px-4 py-2.5 bg-[#e8f0f7]">{other?.spec ?? "—"}</td>
                <td className={`px-4 py-2.5 ${same ? "" : "bg-[#fff8e8]"}`}>
                  {same ? "相同" : "有差异"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CompareExport({
  a,
  b,
}: {
  a: ProposalRecord;
  b: ProposalRecord;
}) {
  const md = `# ${a.package_name} vs ${b.package_name}

## 总价（颗粒板含费）
- ${a.package_name}: ${a.costs.total_particle}
- ${b.package_name}: ${b.costs.total_particle}
- 差额: ${num(b.costs.total_particle) - num(a.costs.total_particle)}

## 全案基础价（颗粒板）
- ${a.package_name}: ${a.costs.base_particle}
- ${b.package_name}: ${b.costs.base_particle}
- 差额: ${num(b.costs.base_particle) - num(a.costs.base_particle)}
`;

  const json = JSON.stringify(
    { a: { package: a.package_name, costs: a.costs }, b: { package: b.package_name, costs: b.costs } },
    null,
    2,
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <h3 className="display mb-2 text-base font-semibold">复制给 AI · Markdown</h3>
        <textarea
          readOnly
          className="h-40 w-full rounded-lg border border-[var(--line)] bg-white/80 p-3 font-mono text-xs"
          value={md}
        />
      </div>
      <div>
        <h3 className="display mb-2 text-base font-semibold">复制给 AI · JSON</h3>
        <textarea
          readOnly
          className="h-40 w-full rounded-lg border border-[var(--line)] bg-white/80 p-3 font-mono text-xs"
          value={json}
        />
      </div>
    </div>
  );
}
