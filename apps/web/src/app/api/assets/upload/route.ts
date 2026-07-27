import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
    const form = await request.formData();
    const file = form.get("file");
    const houseId = String(form.get("houseId") ?? "");
    if (!(file instanceof File) || !houseId) return NextResponse.json({ error: "缺少文件或房屋" }, { status: 400 });
    if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "仅支持 PNG、JPEG、WebP 或 PDF" }, { status: 415 });
    if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: "文件不能超过 20MB" }, { status: 413 });
    const { data: house } = await supabase.from("houses").select("id").eq("id", houseId).eq("owner_id", user.id).maybeSingle();
    if (!house) return NextResponse.json({ error: "房屋不存在或无权访问" }, { status: 403 });
    const safeName = file.name.replace(/[^\p{L}\p{N}._-]+/gu, "-");
    const blob = await put(`users/${user.id}/houses/${houseId}/${safeName}`, file, { access: "public", addRandomSuffix: true });
    const { data: asset, error } = await supabase.from("proposal_assets").insert({
      house_id: houseId,
      owner_id: user.id,
      blob_url: blob.url,
      pathname: blob.pathname,
      mime_type: file.type,
      ocr_status: "uploaded",
    }).select("id,blob_url,pathname,ocr_status").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "上传失败" }, { status: 500 });
  }
}
