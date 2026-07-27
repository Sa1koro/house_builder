import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * service role 客户端：绕过 RLS，仅用于服务端受信任流程
 * （enrich 写公共表、OCR worker 推 draft）。严禁在客户端 import。
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("缺少 SUPABASE_SERVICE_ROLE_KEY，无法执行服务端写入");
  }
  return createSupabaseClient(url, serviceKey, { auth: { persistSession: false } });
}
