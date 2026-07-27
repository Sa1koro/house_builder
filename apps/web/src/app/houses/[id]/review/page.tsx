import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ReviewEditor } from "./review-editor";

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: house } = await supabase.from("houses").select("id,name").eq("id", id).eq("owner_id", user.id).maybeSingle();
  if (!house) notFound();
  const { data: assets } = await supabase.from("proposal_assets").select("id,pathname,ocr_status,ocr_draft").eq("house_id", id).eq("owner_id", user.id).order("created_at", { ascending: false });
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <Link href="/dashboard" className="text-sm text-[#65736b]">← 返回工作台</Link>
      <h1 className="mb-7 mt-3 text-3xl font-semibold">{house.name} · 校对</h1>
      <ReviewEditor assets={assets ?? []} />
    </main>
  );
}
