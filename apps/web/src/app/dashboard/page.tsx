import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createHouse, signOut } from "./actions";
import { UploadForm } from "./upload-form";

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) redirect("/login");
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: houses }, { data: assets }] = await Promise.all([
    supabase.from("houses").select("id,name,city,sale_area,pricing_area,created_at").eq("owner_id", user.id).order("created_at", { ascending: false }),
    supabase.from("proposal_assets").select("id,house_id,pathname,ocr_status,created_at").order("created_at", { ascending: false }).limit(10),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="flex items-end justify-between">
        <div><p className="text-sm text-[#65736b]">{user.email}</p><h1 className="mt-1 text-3xl font-semibold">我的装修工作台</h1></div>
        <form action={signOut}><button className="text-sm text-[#65736b] hover:text-[#174c36]">退出登录</button></form>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="paper rounded-3xl p-6">
          <h2 className="font-semibold">我的房屋</h2>
          <div className="mt-5 space-y-3">
            {houses?.map((house) => <article key={house.id} className="flex items-center justify-between rounded-2xl bg-[#f5f3ee] p-4"><div><b>{house.name}</b><p className="mt-1 text-xs text-[#6b776f]">{house.city || "城市未填"} · 计价 {house.pricing_area}㎡</p></div><Link href={`/houses/${house.id}/review`} className="text-xs text-[#174c36]">校对 OCR →</Link></article>)}
            {!houses?.length && <p className="py-4 text-sm text-[#6b776f]">还没有房屋，先在右侧创建。</p>}
          </div>
        </section>
        <section className="paper rounded-3xl p-6">
          <h2 className="font-semibold">创建房屋</h2>
          <form action={createHouse} className="mt-5 space-y-3">
            <input name="name" required placeholder="例如：滨江 90㎡ 新家" className="w-full rounded-xl bg-[#f5f3ee] px-4 py-3 text-sm outline-none" />
            <input name="city" placeholder="城市" className="w-full rounded-xl bg-[#f5f3ee] px-4 py-3 text-sm outline-none" />
            <div className="grid grid-cols-2 gap-3"><input name="saleArea" type="number" step=".01" placeholder="销售面积㎡" className="w-full rounded-xl bg-[#f5f3ee] px-4 py-3 text-sm outline-none" /><input name="pricingArea" type="number" step=".01" required placeholder="计价面积㎡" className="w-full rounded-xl bg-[#f5f3ee] px-4 py-3 text-sm outline-none" /></div>
            <button className="w-full rounded-xl bg-[#174c36] px-4 py-3 text-sm font-medium text-white">创建</button>
          </form>
        </section>
      </div>
      <section className="paper mt-5 rounded-3xl p-6">
        <h2 className="font-semibold">上传方案原件</h2>
        <p className="mt-2 text-xs text-[#6b776f]">支持 PNG/JPEG/WebP/PDF，单文件最大 20MB。OCR 在本机或自建 worker 执行。</p>
        <div className="mt-5"><UploadForm houses={(houses ?? []).map(({ id, name }) => ({ id, name }))} /></div>
        {!!assets?.length && <div className="mt-6 space-y-2">{assets.map((asset) => <div key={asset.id} className="flex justify-between rounded-xl border border-black/5 px-4 py-3 text-xs"><span className="max-w-[70%] truncate">{asset.pathname}</span><span className="text-[#65736b]">{asset.ocr_status}</span></div>)}</div>}
      </section>
    </main>
  );
}
