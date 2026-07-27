"use client";

import { useState } from "react";

type Asset = { id: string; pathname: string; ocr_status: string; ocr_draft: unknown };

export function ReviewEditor({ assets }: { assets: Asset[] }) {
  const [selected, setSelected] = useState(assets[0]?.id ?? "");
  const current = assets.find((asset) => asset.id === selected);
  const [json, setJson] = useState(current?.ocr_draft ? JSON.stringify(current.ocr_draft, null, 2) : "");
  const [message, setMessage] = useState("");
  const choose = (id: string) => {
    const asset = assets.find((item) => item.id === id);
    setSelected(id);
    setJson(asset?.ocr_draft ? JSON.stringify(asset.ocr_draft, null, 2) : "");
    setMessage("");
  };
  const confirm = async () => {
    try {
      const draft = JSON.parse(json);
      const response = await fetch("/api/proposals/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ assetId: selected, draft }) });
      const result = await response.json();
      setMessage(response.ok ? `已入库，Proposal ID：${result.proposalId}` : result.error);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "JSON 格式错误");
    }
  };
  if (!assets.length) return <p className="rounded-2xl border border-dashed border-black/15 p-8 text-center text-sm text-[#65736b]">这套房还没有上传原件。</p>;
  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="paper h-fit rounded-2xl p-3">{assets.map((asset) => <button key={asset.id} onClick={() => choose(asset.id)} className={`mb-2 w-full rounded-xl p-3 text-left text-xs last:mb-0 ${selected === asset.id ? "bg-[#174c36] text-white" : "bg-[#f5f3ee]"}`}><span className="block truncate font-medium">{asset.pathname.split("/").at(-1)}</span><span className="mt-1 block opacity-60">{asset.ocr_status}</span></button>)}</aside>
      <section className="paper rounded-2xl p-5">
        <div className="flex items-center justify-between"><div><h2 className="font-semibold">OCR 草稿校对</h2><p className="mt-1 text-xs text-[#65736b]">一期先提供 JSON 校对；确认后拆分写入方案及明细表。</p></div><span className="rounded-full bg-[#edf3dc] px-3 py-1 text-xs text-[#587426]">{current?.ocr_status}</span></div>
        {json ? <><textarea value={json} onChange={(event) => setJson(event.target.value)} spellCheck={false} className="mt-5 min-h-[520px] w-full rounded-xl bg-[#17221d] p-5 font-mono text-xs leading-5 text-[#d9e6de] outline-none" /><button onClick={confirm} className="mt-4 rounded-xl bg-[#174c36] px-5 py-3 text-sm font-medium text-white">确认并入库</button></> : <div className="mt-5 rounded-xl bg-[#f5f3ee] p-8 text-center text-sm text-[#65736b]">等待本地 worker 上传草稿。运行 <code>packages/ingest/worker.py</code> 并传入此 asset ID。</div>}
        {message && <p className="mt-4 text-xs text-[#806654]">{message}</p>}
      </section>
    </div>
  );
}
