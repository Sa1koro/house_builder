import Link from "next/link";
import { termSummaries } from "@/lib/demo-data";

export function TermHint({ term }: { term: string }) {
  const summary = termSummaries[term] ?? "点击进入 Wiki 查看定义、验收要点与相关品牌。";
  return (
    <span className="group relative inline-block">
      <Link href={`/wiki/${encodeURIComponent(term)}`} className="rounded bg-[#eaf0d5] px-1.5 py-0.5 text-xs text-[#4c6925] underline decoration-dotted underline-offset-2">
        {term}
      </Link>
      <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-64 -translate-x-1/2 rounded-xl bg-[#163c2d] p-3 text-left text-xs leading-5 text-white shadow-xl group-hover:block group-focus-within:block">
        <b className="mb-1 block text-[#d8f07a]">{term}</b>
        {summary}
      </span>
    </span>
  );
}
