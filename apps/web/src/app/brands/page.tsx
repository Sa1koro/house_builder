import { seedBrands } from "@/lib/demo-data";

const tierStyle: Record<string, string> = {
  入门: "bg-slate-100 text-slate-600",
  主流: "bg-blue-50 text-blue-700",
  一线: "bg-[#edf3dc] text-[#587426]",
  高端: "bg-[#f4e3d5] text-[#8c3e20]",
};

export default async function BrandsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "" } = await searchParams;
  const categories = [...new Set(seedBrands.map((brand) => brand[1]))];
  const brands = seedBrands.filter((brand) => `${brand[0]}${brand[1]}${brand[3]}`.toLowerCase().includes(q.toLowerCase()) && (!category || brand[1] === category));
  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#799067]">供应商品牌库</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">先看系列，再看品牌</h1>
        <p className="mt-4 leading-7 text-[#65736b]">档次标签用于套餐横向参考，不代表任一具体产品。签约时应继续核对系列、型号和服务范围。</p>
      </div>
      <form className="paper mt-8 grid gap-3 rounded-2xl p-3 sm:grid-cols-[1fr_220px_auto]">
        <input name="q" defaultValue={q} placeholder="输入未知品牌…" className="rounded-xl bg-[#f5f3ee] px-4 py-3 text-sm outline-none" />
        <select name="category" defaultValue={category} className="rounded-xl bg-[#f5f3ee] px-4 py-3 text-sm outline-none"><option value="">全部品类</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        <button className="rounded-xl bg-[#174c36] px-6 py-3 text-sm font-medium text-white">检索</button>
      </form>
      <div className="mt-8 overflow-hidden rounded-3xl border border-black/5 bg-[#fffef9]">
        <div className="hidden grid-cols-[1fr_1fr_100px_2fr] gap-5 bg-[#f0f1eb] px-6 py-3 text-xs text-[#6b776f] sm:grid"><span>品牌</span><span>品类</span><span>参考档次</span><span>说明</span></div>
        {brands.map(([name, brandCategory, tier, summary]) => (
          <article key={name} className="grid gap-3 border-t border-black/5 px-6 py-5 first:border-0 sm:grid-cols-[1fr_1fr_100px_2fr] sm:items-center sm:gap-5">
            <h2 className="font-semibold">{name}</h2><span className="text-sm text-[#65736b]">{brandCategory}</span><span className={`w-fit rounded-full px-2.5 py-1 text-xs ${tierStyle[tier]}`}>{tier}</span><p className="text-sm leading-6 text-[#65736b]">{summary}</p>
          </article>
        ))}
      </div>
      {brands.length === 0 && <div className="mt-5 rounded-2xl bg-[#f4e3d5] p-6 text-sm text-[#806654]">本地种子库未命中。部署并配置 ENRICH_API_* 后，POST 到 <code>/api/enrich/brand</code> 会检索、规范化并写入 Supabase。</div>}
    </main>
  );
}
