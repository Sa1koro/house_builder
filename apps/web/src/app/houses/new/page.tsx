import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { createHouse } from "../actions";

export default async function NewHousePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const user = await getUser().catch(() => null);
  if (!user) redirect("/login");

  const input =
    "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="mx-auto max-w-lg space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">新建房屋</h1>
        <p className="mt-1 text-sm text-stone-500">
          注意区分「售卖面积」（购房合同建筑面积）与「计价面积」（装修公司实测报价面积）。
        </p>
      </div>
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      <form action={createHouse} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-stone-700">名称 *</span>
          <input name="name" required placeholder="如：滨江 · 我家 90㎡" className={input} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-stone-700">城市</span>
            <input name="city" placeholder="杭州" className={input} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-stone-700">户型</span>
            <input name="layout" placeholder="两室两厅一卫" className={input} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-stone-700">售卖面积（㎡）</span>
            <input name="sales_area_sqm" type="number" step="0.01" min="0" placeholder="90" className={input} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-stone-700">计价面积（㎡）</span>
            <input name="billing_area_sqm" type="number" step="0.01" min="0" placeholder="76.34" className={input} />
          </label>
        </div>
        <button className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          创建
        </button>
      </form>
    </div>
  );
}
