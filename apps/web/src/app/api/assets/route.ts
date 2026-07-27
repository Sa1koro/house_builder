import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** 上传完成后登记原件（带用户会话，RLS 校验 house 归属）。 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    house_id?: string;
    blob_url?: string;
    pathname?: string;
    mime?: string | null;
    size_bytes?: number;
  } | null;
  if (!body?.house_id || !body?.blob_url) {
    return NextResponse.json({ error: "缺少 house_id / blob_url" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("proposal_assets")
    .insert({
      owner_id: user.id,
      house_id: body.house_id,
      blob_url: body.blob_url,
      pathname: body.pathname ?? null,
      mime: body.mime ?? null,
      size_bytes: body.size_bytes ?? null,
      ocr_status: "pending",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data.id });
}
