"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 检索未命中时的冷启动入口：调 /api/enrich/{kind} 外搜补全并持久化，
 * 成功后跳到新词条页（下次任何用户搜索都直接命中 DB）。
 */
export function EnrichPrompt({ kind, query }: { kind: "brand" | "term"; query: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/enrich/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = (await res.json()) as {
        hit?: string;
        brand?: { slug: string };
        term?: { slug: string };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? `补全失败 (${res.status})`);
      const slug = kind === "brand" ? data.brand?.slug : data.term?.slug;
      if (!slug) throw new Error("补全返回异常");
      router.push(kind === "brand" ? `/brands/${slug}` : `/wiki/${slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "补全失败");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-8 text-center">
      <p className="text-sm text-stone-600">
        库里还没有「<span className="font-semibold text-stone-900">{query}</span>」这个
        {kind === "brand" ? "品牌" : "名词"}。
      </p>
      <button
        onClick={run}
        disabled={busy}
        className="mt-4 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {busy ? "外搜补全中…" : "外搜补全并沉淀为公共词条"}
      </button>
      <p className="mt-2 text-xs text-stone-400">补全后会持久化到公共库，所有用户下次直接命中</p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
