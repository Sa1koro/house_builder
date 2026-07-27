"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TermData {
  slug: string;
  title: string;
  definition: string;
  wikiSlug?: string;
}

interface TermHintProps {
  slug: string;
  children: React.ReactNode;
}

export function TermHint({ slug, children }: TermHintProps) {
  const [term, setTerm] = useState<TermData | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || term) return;
    setLoading(true);
    fetch(`/api/enrich/term?q=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => setTerm(data))
      .catch(() => setTerm(null))
      .finally(() => setLoading(false));
  }, [open, slug, term]);

  return (
    <span
      className="relative inline-block border-b border-dashed border-[var(--primary)] cursor-help"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <span className="absolute z-50 bottom-full left-0 mb-2 w-72 p-3 bg-white border border-[var(--border)] rounded-lg shadow-lg text-sm">
          {loading && <span className="text-[var(--muted)]">加载中…</span>}
          {term && (
            <>
              <strong className="block text-[var(--primary)] mb-1">
                {term.title}
              </strong>
              <span className="text-gray-700">{term.definition}</span>
              <Link
                href={`/wiki/${term.slug}`}
                className="block mt-2 text-xs text-[var(--primary)]"
              >
                查看 Wiki →
              </Link>
            </>
          )}
        </span>
      )}
    </span>
  );
}
