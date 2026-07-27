import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** 邮箱确认 / Magic Link 回跳：把 code 换成会话 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/houses";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("登录链接无效或已过期")}`);
}
