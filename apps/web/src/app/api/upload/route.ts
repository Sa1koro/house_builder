import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const houseId = formData.get("houseId") as string | null;

  if (!file || !houseId) {
    return NextResponse.json(
      { error: "Missing file or houseId" },
      { status: 400 }
    );
  }

  const { data: house } = await supabase
    .from("houses")
    .select("id, owner_id")
    .eq("id", houseId)
    .single();

  if (!house || house.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const blob = await put(`proposals/${houseId}/${file.name}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const { data: asset, error } = await supabase
    .from("proposal_assets")
    .insert({
      house_id: houseId,
      owner_id: user.id,
      blob_url: blob.url,
      mime_type: file.type,
      file_name: file.name,
      ocr_status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ url: blob.url, asset });
}
