import Link from "next/link";
import type { ReactNode } from "react";
import { getWikiPage } from "@/lib/data";
import { notFound } from "next/navigation";

function renderMd(md: string) {
  // Minimal markdown: headings, paragraphs, bold, links
  const lines = md.trim().split(/\n/);
  const nodes: ReactNode[] = [];
  let buf: string[] = [];
  const flush = () => {
    if (!buf.length) return;
    const text = buf.join(" ").trim();
    if (text) {
      nodes.push(
        <p key={`p-${nodes.length}`} dangerouslySetInnerHTML={{ __html: inline(text) }} />,
      );
    }
    buf = [];
  };
  const inline = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(
        /\[(.+?)\]\((\/wiki\/[^\)]+)\)/g,
        '<a href="$2">$1</a>',
      );

  for (const line of lines) {
    if (line.startsWith("# ")) {
      flush();
      nodes.push(
        <h1 key={`h-${nodes.length}`} className="display text-3xl font-semibold">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      flush();
      nodes.push(
        <h2 key={`h-${nodes.length}`} className="display mt-6 text-xl font-semibold">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("- ")) {
      flush();
      nodes.push(
        <li
          key={`li-${nodes.length}`}
          className="ml-5 list-disc text-[var(--muted)]"
          dangerouslySetInnerHTML={{ __html: inline(line.slice(2)) }}
        />,
      );
    } else if (!line.trim()) {
      flush();
    } else {
      buf.push(line);
    }
  }
  flush();
  return nodes;
}

export default async function WikiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getWikiPage(slug);
  if (!page) notFound();

  return (
    <article className="prose-wiki mx-auto max-w-3xl space-y-3">
      <p className="text-sm text-[var(--muted)]">
        <Link href="/wiki" className="hover:text-[var(--sage)]">
          Wiki
        </Link>{" "}
        / {page.title}
      </p>
      {renderMd(page.body_md)}
    </article>
  );
}
