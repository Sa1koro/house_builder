"use client";

import { FormEvent, useState } from "react";

export function UploadForm({ houses }: { houses: { id: string; name: string }[] }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/assets/upload", { method: "POST", body: new FormData(event.currentTarget) });
    const result = await response.json();
    setMessage(response.ok ? "上传成功。请在本地 worker 中处理该 asset，再回来校对。" : result.error);
    setBusy(false);
  };
  if (!houses.length) return <p className="text-sm text-[#65736b]">先创建一套房屋，再上传方案原件。</p>;
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <select name="houseId" required className="rounded-xl bg-[#f5f3ee] px-4 py-3 text-sm">{houses.map((house) => <option key={house.id} value={house.id}>{house.name}</option>)}</select>
      <input name="file" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" required className="rounded-xl bg-[#f5f3ee] px-4 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-1.5" />
      <button disabled={busy} className="rounded-xl bg-[#174c36] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{busy ? "上传中…" : "上传原件"}</button>
      {message && <p className="text-xs text-[#65736b] sm:col-span-3">{message}</p>}
    </form>
  );
}
