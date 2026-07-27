"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function CreateHouseForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError("");
    start(async () => {
      const res = await fetch("/api/houses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          city: fd.get("city"),
          layout: fd.get("layout"),
          sales_area_sqm: Number(fd.get("sales_area_sqm")),
          billing_area_sqm: Number(fd.get("billing_area_sqm")),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "创建失败");
        return;
      }
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-[var(--line)] bg-white/70 p-5"
    >
      <h2 className="display text-lg font-semibold">新建房屋</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="名称" className="rounded-md border border-[var(--line)] px-3 py-2 text-sm" />
        <input name="city" placeholder="城市" className="rounded-md border border-[var(--line)] px-3 py-2 text-sm" />
        <input name="layout" placeholder="户型" className="rounded-md border border-[var(--line)] px-3 py-2 text-sm" />
        <input name="sales_area_sqm" type="number" step="0.01" placeholder="售卖面积" className="rounded-md border border-[var(--line)] px-3 py-2 text-sm" />
        <input name="billing_area_sqm" type="number" step="0.01" placeholder="计价面积" className="rounded-md border border-[var(--line)] px-3 py-2 text-sm" />
      </div>
      {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-[var(--sage)] px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {pending ? "创建中…" : "创建"}
      </button>
    </form>
  );
}
