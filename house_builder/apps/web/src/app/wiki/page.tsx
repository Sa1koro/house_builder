import Link from "next/link";
import { listWikiPages } from "@/lib/data";

export default async function WikiIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const pages = await listWikiPages(q);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-3xl font-semibold">装修 Wiki</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          公共词条全员可读；由种子数据与 enrich 流程沉淀。
        </p>
        <form className="mt-4">
          <input
            name="q"
            defaultValue={q}
            placeholder="搜索名词…"
            className="w-full max-w-md rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm"
          />
        </form>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {pages.map((p) => (
          <li key={p.slug} className="border-t border-[var(--line)] pt-3">
            <Link href={`/wiki/${p.slug}`} className="display text-lg font-semibold hover:text-[var(--sage)]">
              {p.title}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
              {p.body_md.replace(/^#.+\n+/, "").slice(0, 100)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
