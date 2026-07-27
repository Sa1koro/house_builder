import type { HouseRow, LineItemRow, ProposalRow, TermRow } from "@/lib/types";

interface DiffRowLike {
  space: string;
  category: string;
  a: LineItemRow | null;
  b: LineItemRow | null;
  same: boolean;
  termSlugs: string[];
}

const cell = (li: LineItemRow | null) =>
  li ? [li.brand_names.join("/") || li.spec || li.note || "—", li.spec && li.brand_names.length ? `(${li.spec})` : ""].join(" ").trim() : "—";

/** 生成可直接粘贴给 AI 的对比 Markdown（含价格拆解、配置差异、名词释义）。 */
export function buildCompareMarkdown(
  house: HouseRow,
  a: ProposalRow,
  b: ProposalRow,
  diffRows: DiffRowLike[],
  termMap: Map<string, TermRow>
): string {
  const lines: string[] = [];
  lines.push(`# 装修方案对比：${a.company} ${a.package_name} vs ${b.company} ${b.package_name}`);
  lines.push("");
  lines.push(`房屋：${house.name}；售卖面积 ${house.sales_area_sqm ?? "?"}㎡，计价面积 ${house.billing_area_sqm ?? "?"}㎡。`);
  lines.push("");
  lines.push("## 价格拆解");
  lines.push("");
  lines.push(`| 项目 | ${a.package_name} | ${b.package_name} | 差额(B−A) |`);
  lines.push("| --- | ---: | ---: | ---: |");
  const bMap = new Map((b.pricing?.items ?? []).map((i) => [i.key, i]));
  for (const item of a.pricing?.items ?? []) {
    const other = bMap.get(item.key);
    lines.push(
      `| ${item.label} | ${item.amount.toFixed(2)} | ${other ? other.amount.toFixed(2) : "—"} | ${other ? (other.amount - item.amount).toFixed(2) : "—"} |`
    );
  }
  lines.push(
    `| **全案基础价** | **${a.total_base ?? "?"}** | **${b.total_base ?? "?"}** | **${((b.total_base ?? 0) - (a.total_base ?? 0)).toFixed(2)}** |`
  );
  lines.push(
    `| **含费预估** | **${a.total_with_fees ?? "?"}** | **${b.total_with_fees ?? "?"}** | **${((b.total_with_fees ?? 0) - (a.total_with_fees ?? 0)).toFixed(2)}** |`
  );
  lines.push("");
  lines.push("## 配置差异（仅列不同项）");
  lines.push("");
  lines.push(`| 空间 | 品类 | ${a.package_name} | ${b.package_name} |`);
  lines.push("| --- | --- | --- | --- |");
  for (const r of diffRows.filter((r) => !r.same)) {
    lines.push(`| ${r.space} | ${r.category} | ${cell(r.a)} | ${cell(r.b)} |`);
  }
  lines.push("");
  lines.push("## 相关名词");
  lines.push("");
  const slugs = [...new Set(diffRows.flatMap((r) => r.termSlugs))];
  for (const slug of slugs) {
    const t = termMap.get(slug);
    if (t) lines.push(`- **${t.name}**：${t.short_def}`);
  }
  lines.push("");
  if (a.notes.length || b.notes.length) {
    lines.push("## 注意事项");
    lines.push("");
    for (const n of [...new Set([...a.notes, ...b.notes])]) lines.push(`- ${n}`);
    lines.push("");
  }
  lines.push("请基于以上数据，帮我分析两套方案的差价是否值得、有哪些谈判点和需要向门店确认的问题。");
  return lines.join("\n");
}
