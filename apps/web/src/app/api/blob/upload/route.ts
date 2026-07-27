import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Vercel Blob 客户端直传的 token 签发端点。
 * 仅登录用户可写，且 pathname 强制带上自己的 user id 前缀，避免越权覆盖。
 */
export async function POST(request: Request): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ["image/png", "image/jpeg", "image/webp", "application/pdf"],
        maximumSizeInBytes: 30 * 1024 * 1024,
        pathname: `users/${user.id}/${pathname}`,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ userId: user.id }),
      }),
      onUploadCompleted: async () => {
        // 本地开发收不到该回调；资产登记由客户端调 POST /api/assets 完成
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "上传失败" },
      { status: 400 }
    );
  }
}
