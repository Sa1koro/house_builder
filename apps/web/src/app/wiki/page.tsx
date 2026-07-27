import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { TermRow, WikiPageRow } from "@/lib/types";
import { EnrichPrompt } from "@/components/EnrichPrompt";

export default async function WikiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const supabase = await createClient();

  let req = supabase.from("terms").select("*").order("name");
  if (query) {
    const safe = query.replace(/[,()."'\\%]/g, " ").trim();
    req = req.or(`name.ilike.%${safe}%,short_def.ilike.%${safe}%,slug.eq.${safe}`);
  }
  const [{ data: termsData }, { data: wikiData }] = await Promise.all([
    req,
    supabase.from("wiki_pages").select("slug").eq("status", "published"),
  ]);
  const terms = (termsData ?? []) as TermRow[];
  const wikiSlugs = new Set(((wikiData ?? []) as Pick<WikiPageRow, "slug">[]).map((w) => w.slug));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">装修名词 Wiki</h1>
          <p className="mt-1 text-sm text-stone-500">公共词条，全员共建复用；搜不到的词可一键外搜补全</p>
        </div>
        <form method="get" className="flex gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="搜名词：门套 / 强电 / 计价面积…"
            className="w-64 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <button className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
            搜索
          </button>
        </form>
      </div>

      {terms.length === 0 && query ? (
        <EnrichPrompt kind="term" query={query} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map((t) => (
            <Link
              key={t.slug}
              href={`/wiki/${t.slug}`}
              className="group rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-stone-900 group-hover:text-emerald-700">{t.name}</h2>
                <span className="flex items-center gap-1">
                  {wikiSlugs.has(t.slug) && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">长文</span>
                  )}
                  {t.source === "enrich" && (
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] text-sky-700">补全</span>
                  )}
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">{t.short_def}</p>
            </Link>
          ))}
          {terms.length === 0 && (
            <p className="text-sm text-stone-400 sm:col-span-2 lg:col-span-3">
              词条为空 —— 请先在 Supabase 执行 packages/supabase/seed.sql。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
