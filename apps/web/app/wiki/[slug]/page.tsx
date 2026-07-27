import { notFound } from "next/navigation";
import { demoTerms } from "@/lib/demo";

export default async function WikiDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = demoTerms[slug];
  if (!term) notFound();
  return <main><span className="pill">公共词条</span><h1>{term.title}</h1><p>{term.summary}</p><h2>如何使用</h2><p>在报价单里标记这个词，核对合同的具体材料、工艺、计价口径及是否另行收费。</p></main>;
}
