import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { sendMagicLink, signIn, signUp } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  const user = await getUser().catch(() => null);
  if (user) redirect("/houses");

  return (
    <div className="mx-auto max-w-md space-y-6 py-10">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-stone-900">登录 / 注册</h1>
        <p className="text-sm text-stone-500">登录后可创建房屋、上传方案原件、结构化对比</p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      )}

      <form className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-stone-700">邮箱</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-stone-700">密码</span>
          <input
            name="password"
            type="password"
            minLength={6}
            placeholder="至少 6 位"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            formAction={signIn}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            登录
          </button>
          <button
            formAction={signUp}
            className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            注册
          </button>
        </div>
        <div className="border-t border-stone-100 pt-3 text-center">
          <button formAction={sendMagicLink} className="text-sm text-emerald-700 hover:underline">
            不想记密码？发送 Magic Link 到邮箱
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-stone-400">
        未登录也可以
        <Link href="/" className="mx-1 text-emerald-700 hover:underline">
          浏览公开示例房对比
        </Link>
        和名词/品牌库
      </p>
    </div>
  );
}
