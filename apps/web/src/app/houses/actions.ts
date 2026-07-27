"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createHouse(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/houses/new?error=" + encodeURIComponent("请填写房屋名称"));

  const num = (key: string) => {
    const v = String(formData.get(key) ?? "").trim();
    return v ? Number(v) : null;
  };

  const { data, error } = await supabase
    .from("houses")
    .insert({
      owner_id: user.id,
      name,
      city: String(formData.get("city") ?? "").trim() || null,
      layout: String(formData.get("layout") ?? "").trim() || null,
      sales_area_sqm: num("sales_area_sqm"),
      billing_area_sqm: num("billing_area_sqm"),
    })
    .select("id")
    .single();

  if (error || !data) redirect("/houses/new?error=" + encodeURIComponent(error?.message ?? "创建失败"));
  revalidatePath("/houses");
  redirect(`/houses/${data.id}`);
}

export async function deleteHouse(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  await supabase.from("houses").delete().eq("id", id); // RLS 保证只能删自己的
  revalidatePath("/houses");
  redirect("/houses");
}
