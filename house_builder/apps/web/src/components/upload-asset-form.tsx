"use client";

import { useState, useTransition } from "react";

export function UploadAssetForm({ houseId }: { houseId: string }) {
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("houseId", houseId);
    setMsg("");
    start(async () => {
      const res = await fetch("/api/blob/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "上传失败");
        return;
      }
      setMsg(`已上传：${data.url}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-[var(--line)] bg-white/70 p-5">
      <h2 className="display text-lg font-semibold">上传方案原件</h2>
      <p className="text-sm text-[var(--muted)]">
        文件存 Vercel Blob；结构化结果经 OCR 校对后写入 Postgres。
      </p>
      <input type="file" name="file" accept="image/*,application/pdf" required />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[var(--sage)] px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {pending ? "上传中…" : "上传到 Blob"}
      </button>
      {msg ? <p className="text-sm text-[var(--muted)] break-all">{msg}</p> : null}
    </form>
  );
}
