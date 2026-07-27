import Link from "next/link";
import { termSummaries } from "@/lib/demo-data";

export default async function WikiPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const terms = Object.entries(termSummaries).filter(([name, summary]) => `${name}${summary}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#799067]">公共知识库</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">装修 Wiki</h1>
        <p className="mt-4 leading-7 text-[#65736b]">把合同里的专业词，翻译成可核对的验收要点。公共词条跨用户复用，未命中时可由补全服务持久化。</p>
      </div>
      <form className="mt-8">
        <input name="q" defaultValue={q} placeholder="搜索：计价面积、防水、门套…" className="paper w-full rounded-2xl px-5 py-4 outline-none ring-[#174c36]/20 focus:ring-4" />
      </form>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {terms.map(([name, summary]) => (
          <Link key={name} href={`/wiki/${encodeURIComponent(name)}`} className="paper group rounded-2xl p-6 transition hover:-translate-y-0.5 hover:border-[#174c36]/20">
            <div className="flex items-center justify-between"><h2 className="font-semibold">{name}</h2><span className="text-[#799067] transition group-hover:translate-x-1">→</span></div>
            <p className="mt-3 text-sm leading-6 text-[#68756e]">{summary}</p>
            <span className="mt-5 inline-block rounded-full bg-[#edf3dc] px-2.5 py-1 text-[10px] text-[#587426]">社区可见 · seed</span>
          </Link>
        ))}
      </div>
      {terms.length === 0 && <div className="mt-8 rounded-2xl border border-dashed border-black/15 p-8 text-center text-sm text-[#68756e]">没有本地词条。部署后可调用 <code>/api/enrich/term</code> 补全并持久化。</div>}
    </main>
  );
}
