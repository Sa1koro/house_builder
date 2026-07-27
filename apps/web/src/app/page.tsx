import Link from "next/link";
import { demoHouse, money, proposals } from "@/lib/demo-data";

export default function Home() {
  return (
    <main>
      <section className="grid-bg overflow-hidden border-b border-black/5">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#174c36]/15 bg-white/60 px-3 py-1.5 text-xs font-medium text-[#174c36]">
              <span className="size-1.5 rounded-full bg-[#78a728]" />
              装修报价，不再靠猜
            </div>
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#143c2c] sm:text-7xl">
              看懂每一项，
              <br />
              再做<span className="relative mx-2 inline-block">选择<span className="absolute inset-x-0 bottom-1 -z-10 h-4 -rotate-1 bg-[#d8f07a]" /></span>。
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#617068]">
              上传装修方案，结构化比较总价、主材与施工范围。遇到陌生品牌和名词，随时查清再签字。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/login" className="rounded-full bg-[#174c36] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d3826]">免费整理我的方案</Link>
              <Link href="/houses/demo-90sqm/compare" className="rounded-full border border-[#174c36]/20 bg-white/70 px-6 py-3 text-sm font-semibold text-[#174c36] transition hover:bg-white">先看真实对比 →</Link>
            </div>
            <div className="mt-12 flex gap-8 text-sm text-[#617068]">
              <span><b className="block text-xl text-[#143c2c]">33</b>项配置逐项比</span>
              <span><b className="block text-xl text-[#143c2c]">20+</b>品牌档次参考</span>
              <span><b className="block text-xl text-[#143c2c]">私有</b>数据按房屋隔离</span>
            </div>
          </div>
          <div className="paper relative self-center rounded-[2rem] p-4 sm:p-6">
            <div className="mb-5 flex items-start justify-between px-2 pt-1">
              <div><p className="text-xs text-[#758078]">公开示例 · {demoHouse.city}</p><h2 className="mt-1 text-lg font-semibold">{demoHouse.name}</h2></div>
              <span className="rounded-full bg-[#edf3dc] px-3 py-1 text-xs text-[#4f691d]">{demoHouse.pricingArea}㎡ 计价</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[proposals.aes, proposals.a5s].map((proposal, index) => (
                <div key={proposal.id} className={`rounded-2xl p-5 ${index ? "bg-[#174c36] text-white" : "bg-[#eef0ea]"}`}>
                  <p className={`text-xs ${index ? "text-white/60" : "text-[#758078]"}`}>{proposal.company}</p>
                  <div className="mt-1 flex items-baseline justify-between"><h3 className="text-2xl font-semibold">{proposal.name}</h3>{index === 1 && <span className="rounded-full bg-[#d8f07a] px-2 py-1 text-[10px] font-bold text-[#174c36]">配置更全</span>}</div>
                  <p className="mt-7 text-xs opacity-60">含费预估 · 颗粒板</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{money(proposal.total)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#f7e7dc] px-5 py-4 text-sm">
              <span className="text-[#765446]">A5s 含费价差</span>
              <b className="text-[#8c3e20]">+ {money(proposals.a5s.total - proposals.aes.total)}</b>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#6c7d73]">从原件到决策</p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            ["01", "上传原件", "长图或 PDF 安全存入 Blob，本地 OCR 生成可校对草稿。"],
            ["02", "逐项看懂", "报价拆成价格、空间、品类与品牌；名词悬停即查。"],
            ["03", "做出选择", "并排查看差异，复制 Markdown 或 JSON 继续问 AI。"],
          ].map(([number, title, text]) => (
            <article key={number} className="paper rounded-3xl p-7"><span className="font-mono text-xs text-[#799067]">{number}</span><h2 className="mt-8 text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-[#68756e]">{text}</p></article>
          ))}
        </div>
      </section>
    </main>
  );
}
