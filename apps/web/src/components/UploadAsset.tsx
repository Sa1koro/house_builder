"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

/** 上传方案原件（长图/PDF）到 Vercel Blob，然后登记到 proposal_assets。 */
export function UploadAsset({ houseId }: { houseId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await upload(`${houseId}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        clientPayload: JSON.stringify({ houseId }),
      });
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          house_id: houseId,
          blob_url: blob.url,
          pathname: blob.pathname,
          mime: file.type || null,
          size_bytes: file.size,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `登记失败 (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label
        className={`flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-sm transition ${
          busy
            ? "border-stone-200 bg-stone-50 text-stone-400"
            : "border-emerald-300 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="hidden"
          disabled={busy}
          onChange={onFileChange}
        />
        {busy ? "上传中…" : "点击上传方案长图 / PDF（存 Vercel Blob）"}
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
