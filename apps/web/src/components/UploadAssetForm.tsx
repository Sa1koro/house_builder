"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadAssetForm({ houseId }: { houseId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("houseId", houseId);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error ?? "上传失败");
    } else {
      setStatus(`已上传：${data.url}`);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleUpload} className="space-y-3">
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-sm"
      />
      <button
        type="submit"
        disabled={!file || loading}
        className="btn btn-primary text-sm"
      >
        {loading ? "上传中…" : "上传到 Blob"}
      </button>
      {status && <p className="text-sm text-[var(--muted)]">{status}</p>}
      <p className="text-xs text-[var(--muted)]">
        上传后可用本地 OCR worker 解析，再在校对页确认入库。
      </p>
    </form>
  );
}
