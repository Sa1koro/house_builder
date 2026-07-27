"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Term } from "@house-builder/schema";

export function TermHint({
  slug,
  label,
  term,
}: {
  slug: string;
  label?: string;
  term?: Term | null;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  if (!term) {
    return <span>{label ?? slug}</span>;
  }

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="term-hint bg-transparent p-0 text-left"
        aria-describedby={open ? id : undefined}
      >
        {label ?? term.name}
      </button>
      {open ? (
        <span id={id} role="tooltip" className="term-pop left-0 top-[calc(100%+6px)]">
          <span className="display mb-1 block text-sm font-semibold text-[var(--ink)]">
            {term.name}
          </span>
          <span className="block text-xs leading-relaxed text-[var(--muted)]">
            {term.summary}
          </span>
          <Link
            href={`/wiki/${term.wiki_slug || term.slug}`}
            className="mt-2 inline-block text-xs text-[var(--sage)] underline underline-offset-2"
          >
            打开 Wiki
          </Link>
        </span>
      ) : null}
    </span>
  );
}
