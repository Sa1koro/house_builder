import Link from "next/link";
import { listHousesForUser, listProposals } from "@/lib/data";
import { DEMO_A5S_ID, DEMO_AES_ID } from "@/lib/local-store";
import { createClient } from "@/lib/supabase/server";
import { CreateHouseForm } from "@/components/create-house-form";

export default async function HousesPage() {
  const houses = await listHousesForUser();
  const supabase = await createClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  const withProposals = await Promise.all(
    houses.map(async (h) => ({
      house: h,
      proposals: await listProposals(h.id),
    })),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display text-3xl font-semibold">我的房屋</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          私有房屋按用户隔离（RLS：owner_id = auth.uid()）。公开 Demo 未登录也可浏览。
        </p>
      </div>

      <div className="grid gap-4">
        {withProposals.map(({ house: h, proposals }) => {
          const a = proposals[0]?.id ?? DEMO_AES_ID;
          const b = proposals[1]?.id ?? DEMO_A5S_ID;
          return (
            <div
              key={h.id}
              className="flex flex-col justify-between gap-3 border-t border-[var(--line)] py-4 sm:flex-row sm:items-center"
            >
              <div>
                <h2 className="display text-xl font-semibold">{h.name}</h2>
                <p className="text-sm text-[var(--muted)]">
                  {h.city ?? "—"} · {h.layout ?? "—"} · 售卖 {h.sales_area_sqm}㎡ /
                  计价 {h.billing_area_sqm}㎡
                  {h.is_public_demo ? " · 公开 Demo" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <Link
                  href={`/houses/${h.id}/compare?a=${a}&b=${b}`}
                  className="rounded-md bg-[var(--sage)] px-3 py-1.5 text-white"
                >
                  对比方案
                </Link>
                {user && !h.is_public_demo ? (
                  <Link
                    href={`/houses/${h.id}/upload`}
                    className="rounded-md border border-[var(--line)] px-3 py-1.5"
                  >
                    上传原件
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {user ? (
        <CreateHouseForm />
      ) : (
        <p className="text-sm text-[var(--muted)]">
          配置 Supabase 并{" "}
          <Link href="/login" className="text-[var(--sage)] underline">
            登录
          </Link>{" "}
          后可创建私有房屋、上传 Blob 原件。
        </p>
      )}
    </div>
  );
}
