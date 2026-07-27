import Link from "next/link";
import type { TermRow } from "@/lib/types";

/**
 * 名词悬停释义：纯 CSS tooltip（group-hover），点击进入 Wiki 长文。
 * 由服务端把 term 数据随页面下发，悬停零请求。
 */
export function TermHint({ term }: { term: TermRow }) {
  return (
    <span className="group/term relative inline-block">
      <Link
        href={`/wiki/${term.slug}`}
        className="cursor-help rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700 underline decoration-emerald-300 decoration-dotted underline-offset-2 hover:bg-emerald-100"
      >
        {term.name}
      </Link>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl border border-stone-200 bg-white p-3 text-left shadow-lg opacity-0 transition group-hover/term:visible group-hover/term:opacity-100"
      >
        <span className="block text-xs font-semibold text-stone-900">{term.name}</span>
        <span className="mt-1 block text-xs leading-5 text-stone-600">{term.short_def}</span>
        <span className="mt-1 block text-[10px] text-emerald-600">点击查看 Wiki 长文 →</span>
      </span>
    </span>
  );
}
