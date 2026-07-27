import Link from "next/link";
import { createClient, getUser } from "@/lib/supabase/server";
import type { HouseRow } from "@/lib/types";

export default async function HousesPage() {
  const supabase = await createClient();
  const user = await getUser();

  const { data } = await supabase
    .from("houses")
    .select("*")
    .order("is_public_demo", { ascending: true })
    .order("created_at", { ascending: false });
  const houses = (data ?? []) as HouseRow[];
  const mine = houses.filter((h) => user && h.owner_id === user.id);
  const demos = houses.filter((h) => h.is_public_demo && (!user || h.owner_id !== user.id));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">我的房屋</h1>
        {user ? (
          <Link
            href="/houses/new"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + 新建房屋
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-emerald-700 hover:underline">
            登录后创建自己的房屋 →
          </Link>
        )}
      </div>

      {user && (
        <section className="grid gap-4 sm:grid-cols-2">
          {mine.length === 0 && (
            <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500 sm:col-span-2">
              还没有房屋。点击右上角「新建房屋」，然后上传你的装修方案。
            </p>
          )}
          {mine.map((h) => (
            <HouseCard key={h.id} house={h} />
          ))}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">公开示例（未登录可看）</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {demos.map((h) => (
            <HouseCard key={h.id} house={h} demo />
          ))}
          {demos.length === 0 && (
            <p className="text-sm text-stone-400">
              暂无示例房 —— 请先在 Supabase 执行 packages/supabase/seed.sql。
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function HouseCard({ house, demo }: { house: HouseRow; demo?: boolean }) {
  return (
    <Link
      href={`/houses/${house.id}`}
      className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700">{house.name}</h3>
        {demo && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs text-sky-700">示例</span>}
      </div>
      <p className="mt-2 text-sm text-stone-500">
        {[house.city, house.layout].filter(Boolean).join(" · ") || "—"}
      </p>
      <p className="mt-1 text-xs text-stone-400">
        售卖 {house.sales_area_sqm ?? "—"}㎡ · 计价 {house.billing_area_sqm ?? "—"}㎡
      </p>
    </Link>
  );
}
