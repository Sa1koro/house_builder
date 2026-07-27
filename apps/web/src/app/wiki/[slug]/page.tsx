import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import type { TermRow, WikiPageRow } from "@/lib/types";

export default async function WikiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: termData }, { data: pageData }] = await Promise.all([
    supabase.from("terms").select("*").eq("slug", slug).maybeSingle(),
    supabase.from("wiki_pages").select("*").eq("slug", slug).eq("status", "published").maybeSingle(),
  ]);
  if (!termData && !pageData) notFound();
  const term = termData as TermRow | null;
  const page = pageData as WikiPageRow | null;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm text-stone-500">
        <Link href="/wiki" className="hover:text-emerald-700 hover:underline">
          ← 名词 Wiki
        </Link>
      </p>
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-stone-900">{term?.name ?? page?.title}</h1>
          {term?.source === "enrich" && (
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">
              外搜补全 · 置信度 {Math.round((term.confidence ?? 0) * 100)}%
            </span>
          )}
        </div>
        {term && (
          <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            {term.short_def}
          </p>
        )}
        {term && term.aliases.length > 0 && (
          <p className="text-xs text-stone-400">别名：{term.aliases.join(" / ")}</p>
        )}
      </header>

      {page ? (
        <div className="prose prose-stone max-w-none rounded-2xl border border-stone-200 bg-white p-6 shadow-sm prose-headings:scroll-mt-20">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.body_md}</ReactMarkdown>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-400">
          这个词条还没有长文（当前只有一句话释义）。
        </p>
      )}
    </article>
  );
}
