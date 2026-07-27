import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function createHouse(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("houses").insert({ owner_id: user.id, name: String(formData.get("name")), city: String(formData.get("city") || ""), usable_area_sqm: Number(formData.get("area")) || null });
  revalidatePath("/houses");
}

export default async function HousesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: houses } = await supabase.from("houses").select("id,name,city,usable_area_sqm,created_at").eq("owner_id", user.id).order("created_at", { ascending: false });
  return <main><span className="pill">私有空间</span><h1>我的房屋与方案</h1>
    <form action={createHouse} className="card"><div className="grid"><label>房屋名称<input name="name" required placeholder="我的新家" /></label><label>城市<input name="city" placeholder="杭州" /></label><label>套内面积㎡<input name="area" inputMode="decimal" /></label></div><p><button>创建房屋</button></p></form>
    <div className="grid" style={{ marginTop: "1rem" }}>{houses?.map(h => <article className="card" key={h.id}><h2>{h.name}</h2><p>{h.city || "未填写城市"} · {h.usable_area_sqm || "—"}㎡</p><Link href={`/houses/${h.id}/compare`}>管理方案与对比 →</Link></article>)}</div>
  </main>;
}
