import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMO_HOUSE_ID } from "@/lib/utils";
import { DEMO_HOUSE, isSupabaseConfigured } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function HousesPage() {
  let houses: Array<{
    id: string;
    name: string;
    city: string | null;
    pricing_area_sqm: number;
    is_public_demo: boolean;
  }> = [];
  let user = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const userRes = await supabase.auth.getUser();
    user = userRes.data.user;
    const { data } = await supabase
      .from("houses")
      .select("id, name, city, pricing_area_sqm, is_public_demo")
      .order("created_at", { ascending: false });
    houses = data ?? [];
  }

  if (!houses.some((h) => h.id === DEMO_HOUSE_ID)) {
    houses = [DEMO_HOUSE, ...houses];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的房屋</h1>
        {user && (
          <Link href="/houses/new" className="btn btn-primary">
            新建房屋
          </Link>
        )}
      </div>

      {!user && (
        <p className="text-sm text-[var(--muted)]">
          <Link href="/login" className="underline">
            登录
          </Link>{" "}
          后可创建私有房屋；下方为公开 Demo。
        </p>
      )}

      <div className="grid gap-4">
        {(houses ?? []).map((house) => (
          <Link
            key={house.id}
            href={`/houses/${house.id}`}
            className="card hover:border-[var(--primary)] transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold">{house.name}</h2>
                <p className="text-sm text-[var(--muted)]">
                  {house.city} · 计价 {house.pricing_area_sqm}㎡
                </p>
              </div>
              {house.is_public_demo && (
                <span className="badge badge-diff">公开 Demo</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <Link
        href={`/houses/${DEMO_HOUSE_ID}`}
        className="text-sm text-[var(--primary)]"
      >
        → 直接打开 Demo 房屋
      </Link>
    </div>
  );
}
