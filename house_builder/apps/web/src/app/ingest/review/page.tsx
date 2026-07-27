"use client";

import { useEffect, useState, useTransition } from "react";
import type { Proposal } from "@house-builder/schema";

type Draft = {
  asset_id?: string;
  proposal: Proposal;
  ocr_text_preview?: string;
  needs_review?: boolean;
};

export default function IngestReviewPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selected, setSelected] = useState(0);
  const [jsonText, setJsonText] = useState("");
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();

  useEffect(() => {
    fetch("/api/ingest/draft")
      .then((r) => r.json())
      .then((d) => {
        const list = (d.drafts ?? []) as Draft[];
        setDrafts(list);
        if (list[0]) setJsonText(JSON.stringify(list[0].proposal, null, 2));
      });
  }, []);

  function load(i: number) {
    setSelected(i);
    if (drafts[i]) setJsonText(JSON.stringify(drafts[i].proposal, null, 2));
  }

  function confirm() {
    setMsg("");
    start(async () => {
      let proposal: Proposal;
      try {
        proposal = JSON.parse(jsonText);
      } catch {
        setMsg("JSON 无法解析");
        return;
      }
      const res = await fetch("/api/ingest/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: drafts[selected]?.asset_id,
          proposal,
        }),
      });
      const data = await res.json();
      setMsg(res.ok ? `已入库 proposal ${data.id ?? ""}` : data.error || "失败");
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl font-semibold">OCR 草稿校对</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          本地 worker 推送 draft → 人工校对 → 写入 proposals。详见{" "}
          <code>packages/ingest/README.md</code>。
        </p>
      </div>

      {!drafts.length ? (
        <p className="rounded-xl border border-dashed border-[var(--line)] bg-white/50 p-6 text-sm text-[var(--muted)]">
          暂无草稿。运行本地 OCR worker 并 <code>--post</code> 到{" "}
          <code>/api/ingest/draft</code>，或粘贴下方 JSON 作为演练。
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {drafts.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => load(i)}
              className={`rounded-md px-3 py-1.5 text-sm ${
                i === selected
                  ? "bg-[var(--sage)] text-white"
                  : "border border-[var(--line)]"
              }`}
            >
              {d.proposal.package_name || `draft-${i}`}
            </button>
          ))}
        </div>
      )}

      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        className="h-96 w-full rounded-xl border border-[var(--line)] bg-white/80 p-4 font-mono text-xs"
        placeholder='{"company":"…","package_name":"…","costs":{…},"line_items":[]}'
      />

      <button
        type="button"
        onClick={confirm}
        disabled={pending}
        className="rounded-md bg-[var(--sage)] px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {pending ? "提交中…" : "确认入库"}
      </button>
      {msg ? <p className="text-sm text-[var(--muted)]">{msg}</p> : null}
    </div>
  );
}
