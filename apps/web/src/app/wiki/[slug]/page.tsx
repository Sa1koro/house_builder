import Link from "next/link";
import { notFound } from "next/navigation";
import { termSummaries } from "@/lib/demo-data";

export default async function WikiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  const summary = termSummaries[name];
  if (!summary) notFound();
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link href="/wiki" className="text-sm text-[#65736b] hover:text-[#174c36]">← 返回 Wiki</Link>
      <article className="paper mt-6 rounded-3xl p-7 sm:p-10">
        <span className="rounded-full bg-[#edf3dc] px-3 py-1 text-xs text-[#587426]">公共词条 · 已发布</span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">{name}</h1>
        <p className="mt-5 text-lg leading-8 text-[#54645b]">{summary}</p>
        <hr className="my-8 border-black/5" />
        <h2 className="text-xl font-semibold">签约与验收要点</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-[#65736b]">
          <li>核对合同中的材料品牌、系列、型号、数量及施工范围。</li>
          <li>确认人工、辅料、损耗、运输和成品保护是否包含。</li>
          <li>隐蔽项目施工前后拍照，关键节点按合同验收并留档。</li>
        </ul>
        <div className="mt-9 rounded-2xl bg-[#f5f3ee] p-5 text-xs leading-5 text-[#738078]">知识内容仅用于辅助理解报价，实际工程以合同、产品检测报告和当地规范为准。</div>
      </article>
    </main>
  );
}
