import Link from "next/link";
import { getUser } from "@/lib/supabase/server";

export async function Nav() {
  let email: string | null = null;
  let configured = true;
  try {
    const user = await getUser();
    email = user?.email ?? null;
  } catch {
    configured = false;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-5 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-stone-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-sm text-white">装</span>
          装修帮
        </Link>
        <nav className="flex flex-1 items-center gap-1 text-sm text-stone-600">
          <Link href="/houses" className="rounded-md px-2.5 py-1.5 hover:bg-stone-100 hover:text-stone-900">我的房屋</Link>
          <Link href="/wiki" className="rounded-md px-2.5 py-1.5 hover:bg-stone-100 hover:text-stone-900">名词 Wiki</Link>
          <Link href="/brands" className="rounded-md px-2.5 py-1.5 hover:bg-stone-100 hover:text-stone-900">品牌库</Link>
          <Link href="/tools" className="rounded-md px-2.5 py-1.5 hover:bg-stone-100 hover:text-stone-900">工具</Link>
        </nav>
        {!configured ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">未配置 Supabase 环境变量</span>
        ) : email ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-stone-500 sm:inline">{email}</span>
            <form action="/auth/signout" method="post">
              <button className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-stone-100">
                退出
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-md bg-emerald-600 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            登录 / 注册
          </Link>
        )}
      </div>
    </header>
  );
}
