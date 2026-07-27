import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase 未配置" }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("houses")
    .insert({
      owner_id: user.id,
      name: String(body.name ?? "").trim() || "未命名房屋",
      city: body.city || null,
      layout: body.layout || null,
      sales_area_sqm: body.sales_area_sqm ?? null,
      billing_area_sqm: body.billing_area_sqm ?? null,
      is_public_demo: false,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ house: data });
}
