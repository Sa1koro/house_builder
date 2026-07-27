import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const response = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname) => {
      if (!pathname.startsWith(`assets/${user.id}/`)) throw new Error("Invalid upload path");
      return { allowedContentTypes: ["application/pdf", "image/png", "image/jpeg"], addRandomSuffix: true, tokenPayload: JSON.stringify({ userId: user.id }) };
    },
    onUploadCompleted: async () => {},
  });
  return Response.json(response);
}
