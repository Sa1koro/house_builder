import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMO_TERMS, isSupabaseConfigured } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function WikiListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let terms = DEMO_TERMS;
  let wikiPages: Array<{ slug: string; title: string; term_slug: string | null }> = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase
      .from("terms")
      .select("slug, title, definition, category")
      .order("title");

    if (q) {
      query = query.or(`title.ilike.%${q}%,definition.ilike.%${q}%`);
    }

    const { data } = await query.limit(50);
    if (data?.length) terms = data;

    const { data: pages } = await supabase
      .from("wiki_pages")
      .select("slug, title, term_slug")
      .order("title")
      .limit(20);
    wikiPages = pages ?? [];
  } else if (q) {
    terms = DEMO_TERMS.filter(
      (t) =>
        t.title.includes(q) ||
        t.definition.includes(q) ||
        t.slug.includes(q)
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">装修 Wiki</h1>
      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="搜索名词…"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button type="submit" className="btn btn-primary">
          搜索
        </button>
      </form>

      <section>
        <h2 className="font-semibold mb-3">名词词条</h2>
        <div className="grid gap-3">
          {(terms ?? []).map((term) => (
            <Link
              key={term.slug}
              href={`/wiki/${term.slug}`}
              className="card hover:border-[var(--primary)] block"
            >
              <div className="flex justify-between">
                <span className="font-medium">{term.title}</span>
                {term.category && (
                  <span className="text-xs text-[var(--muted)]">
                    {term.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {term.definition}
              </p>
            </Link>
          ))}
        </div>
        {q && (!terms || terms.length === 0) && (
          <p className="text-sm text-[var(--muted)] mt-4">
            未找到「{q}」，尝试{" "}
            <Link
              href={`/api/enrich/term?q=${encodeURIComponent(q)}`}
              className="underline"
            >
              自动补全
            </Link>
          </p>
        )}
      </section>

      {wikiPages && wikiPages.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">长文指南</h2>
          <ul className="space-y-2">
            {wikiPages.map((page) => (
              <li key={page.slug}>
                <Link href={`/wiki/${page.term_slug ?? page.slug}`}>
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
