"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TierBadge } from "@/components/tier-badge";
import type { Brand } from "@house-builder/schema";

export function BrandEnrichForm() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Brand | null>(null);
  const [meta, setMeta] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/enrich/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "enrich failed");
        return;
      }
      setResult(data.brand);
      setMeta(
        data.from_cache
          ? "已命中库内品牌"
          : data.created
            ? "冷启动补全并已持久化"
            : "完成",
      );
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/70 p-5">
      <h2 className="display text-lg font-semibold">品牌冷启动</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        库中没有时会调用 enrich（默认 mock）并写入品牌库，刷新后仍在。
      </p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入未知品牌，如：科勒"
          className="flex-1 rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--sage)]"
          required
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[var(--sage)] px-4 py-2 text-sm text-white hover:bg-[var(--sage-deep)] disabled:opacity-60"
        >
          {pending ? "补全中…" : "查找 / 补全"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
      {result ? (
        <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">{result.name}</span>
            <TierBadge tier={result.tier} />
            <span className="text-xs text-[var(--muted)]">{meta}</span>
          </div>
          <p className="mt-2 text-[var(--muted)]">{result.summary}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">slug: {result.slug}</p>
        </div>
      ) : null}
    </div>
  );
}
