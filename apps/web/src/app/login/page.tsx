import { isSupabaseConfigured } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#799067]">你的装修工作台</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">一套房一个空间，<br />每版方案都有据可查。</h1>
        <p className="mt-5 max-w-md leading-7 text-[#65736b]">注册后创建房屋、上传报价原件，并在本地 OCR 生成草稿后回到网页逐项校对。</p>
      </div>
      <LoginForm configured={isSupabaseConfigured()} />
    </main>
  );
}
