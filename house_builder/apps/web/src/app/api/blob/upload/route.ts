import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase 未配置，无法关联资产所有者" },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN 未配置" },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  const houseId = String(form.get("houseId") ?? "");
  if (!(file instanceof File) || !houseId) {
    return NextResponse.json({ error: "file 与 houseId 必填" }, { status: 400 });
  }

  const { data: house } = await supabase
    .from("houses")
    .select("id, owner_id")
    .eq("id", houseId)
    .maybeSingle();

  if (!house || house.owner_id !== user.id) {
    return NextResponse.json({ error: "无权上传到此房屋" }, { status: 403 });
  }

  const pathname = `houses/${houseId}/${user.id}/${Date.now()}-${file.name}`;
  const blob = await put(pathname, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const { data: asset, error } = await supabase
    .from("proposal_assets")
    .insert({
      house_id: houseId,
      owner_id: user.id,
      blob_url: blob.url,
      pathname: blob.pathname,
      mime: file.type,
      size_bytes: file.size,
      ocr_status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message, url: blob.url }, { status: 500 });
  }

  return NextResponse.json({ url: blob.url, asset });
}
