"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewHousePage() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [salesArea, setSalesArea] = useState("");
  const [pricingArea, setPricingArea] = useState("");
  const [layout, setLayout] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("houses")
      .insert({
        owner_id: user.id,
        name,
        city: city || null,
        sales_area_sqm: salesArea ? parseFloat(salesArea) : null,
        pricing_area_sqm: parseFloat(pricingArea),
        layout: layout || null,
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push(`/houses/${data.id}`);
  }

  return (
    <div className="max-w-lg mx-auto card space-y-4">
      <h1 className="text-2xl font-bold">新建房屋</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">名称 *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">城市</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">售卖面积 ㎡</label>
            <input
              type="number"
              step="0.01"
              value={salesArea}
              onChange={(e) => setSalesArea(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">计价面积 ㎡ *</label>
            <input
              type="number"
              step="0.01"
              value={pricingArea}
              onChange={(e) => setPricingArea(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">户型</label>
          <input
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            placeholder="如：三房一卫"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">
          创建
        </button>
      </form>
    </div>
  );
}
