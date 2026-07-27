import { notFound } from "next/navigation";
import { CopyButtons } from "@/components/copy-buttons";
import { TermHint } from "@/components/term-hint";
import { demoHouse, demoLines, money, proposals } from "@/lib/demo-data";

export default async function ComparePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== demoHouse.id && id !== "00000000-0000-4000-8000-000000000001") notFound();
  const priceRows = [
    ["硬装小计", proposals.aes.hardFit, proposals.a5s.hardFit],
    ["全屋定制（颗粒板 15㎡）", proposals.aes.customization, proposals.a5s.customization],
    ["工程管理费 12%", proposals.aes.management, proposals.a5s.management],
    ["项目经理费 2%（估）", proposals.aes.projectManager, proposals.a5s.projectManager],
  ] as const;

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm text-[#6b776f]">{demoHouse.city} · {demoHouse.layout} · 销售面积 {demoHouse.saleArea}㎡</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">AEs 与 A5s 逐项对比</h1>
          <p className="mt-2 text-sm text-[#6b776f]">计价面积 <TermHint term="计价面积" /> {demoHouse.pricingArea}㎡ · 颗粒板方案 · 数据来自宣传页人工核对</p>
        </div>
        <CopyButtons />
      </div>

      <section className="mt-9 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        {[proposals.aes, proposals.a5s].map((proposal, i) => (
          <article key={proposal.id} className={`rounded-3xl p-7 ${i ? "bg-[#174c36] text-white" : "paper"}`}>
            <p className={`text-xs ${i ? "text-white/60" : "text-[#6b776f]"}`}>{proposal.company} · 宣传页 2026</p>
            <h2 className="mt-2 text-3xl font-semibold">{proposal.name}</h2>
            <p className="mt-8 text-xs opacity-60">含费预估</p>
            <p className="mt-1 text-3xl font-semibold">{money(proposal.total)}</p>
          </article>
        ))}
        <article className="rounded-3xl bg-[#f4e3d5] p-7">
          <p className="text-xs text-[#806654]">价差 A5s − AEs</p>
          <p className="mt-11 text-3xl font-semibold text-[#8c3e20]">+{money(proposals.a5s.total - proposals.aes.total)}</p>
          <p className="mt-3 text-sm leading-6 text-[#806654]">主要换来门、防水、地板品牌池扩大，以及明确包含淋浴房。</p>
        </article>
      </section>

      <section className="paper mt-5 overflow-hidden rounded-3xl">
        <div className="border-b border-black/5 px-6 py-5"><h2 className="font-semibold">总价拆解</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-[#f5f5f0] text-left text-xs text-[#6b776f]"><tr><th className="px-6 py-3">项目</th><th className="px-6 py-3">AEs</th><th className="px-6 py-3">A5s</th><th className="px-6 py-3">价差</th></tr></thead>
            <tbody>{priceRows.map(([label, aes, a5s]) => <tr key={label} className="border-t border-black/5"><td className="px-6 py-4">{label}</td><td className="px-6 py-4 font-mono">{money(aes)}</td><td className="px-6 py-4 font-mono">{money(a5s)}</td><td className="px-6 py-4 font-mono text-[#9b4a2b]">+{money(a5s - aes)}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="paper mt-5 overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5"><h2 className="font-semibold">33 项配置</h2><span className="rounded-full bg-[#edf3dc] px-3 py-1 text-xs text-[#587426]">{demoLines.filter((line) => line.note !== "相同").length} 项有差异</span></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-[#f5f5f0] text-left text-xs text-[#6b776f]"><tr><th className="px-5 py-3">空间 / 项目</th><th className="px-5 py-3">AEs</th><th className="px-5 py-3">A5s</th><th className="px-5 py-3">结论</th></tr></thead>
            <tbody>{demoLines.map((line, index) => (
              <tr key={`${line.space}-${line.category}`} className={`border-t border-black/5 ${line.note !== "相同" ? "bg-[#fffaf0]" : ""}`}>
                <td className="px-5 py-4 align-top"><span className="block text-xs text-[#829087]">{line.space}</span><b className="mt-1 block">{line.category}</b><span className="mt-2 flex flex-wrap gap-1">{line.terms.map((term) => <TermHint key={`${index}-${term}`} term={term} />)}</span></td>
                <td className="max-w-xs px-5 py-4 align-top leading-6">{line.aes}</td>
                <td className="max-w-xs px-5 py-4 align-top leading-6">{line.a5s}</td>
                <td className={`px-5 py-4 align-top text-xs font-medium ${line.note !== "相同" ? "text-[#8c3e20]" : "text-[#809087]"}`}>{line.note}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
