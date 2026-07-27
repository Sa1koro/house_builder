import { getHouse } from "@/lib/data";
import { UploadAssetForm } from "@/components/upload-asset-form";
import { notFound } from "next/navigation";

export default async function UploadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const house = await getHouse(id);
  if (!house) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl font-semibold">上传 · {house.name}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          需登录且为房屋所有者。未配置 Blob/Supabase 时接口会返回明确错误。
        </p>
      </div>
      <UploadAssetForm houseId={id} />
    </div>
  );
}
