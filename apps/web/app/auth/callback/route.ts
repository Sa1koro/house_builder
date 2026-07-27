import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const cookieStore = await cookies();
  const response = NextResponse.redirect(new URL("/houses", url.origin));
  if (code) {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: { getAll: () => cookieStore.getAll(), setAll: entries => entries.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) }
    });
    await supabase.auth.exchangeCodeForSession(code);
  }
  return response;
}
