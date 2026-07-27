"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createHouse(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const name = String(formData.get("name") ?? "").trim();
  const pricingArea = Number(formData.get("pricingArea"));
  if (!name || !Number.isFinite(pricingArea) || pricingArea <= 0) throw new Error("房屋名称与计价面积必填");
  const { error } = await supabase.from("houses").insert({
    owner_id: user.id,
    name,
    city: String(formData.get("city") ?? "").trim() || null,
    sale_area: Number(formData.get("saleArea")) || null,
    pricing_area: pricingArea,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
