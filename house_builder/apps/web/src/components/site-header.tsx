import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const links = [
  { href: "/houses/aaaaaaaa-bbbb-cccc-dddd-000000000001/compare?a=aaaaaaaa-bbbb-cccc-dddd-0000000000a1&b=aaaaaaaa-bbbb-cccc-dddd-0000000000a5", label: "Demo 对比" },
  { href: "/wiki", label: "Wiki" },
  { href: "/brands", label: "品牌库" },
  { href: "/tools", label: "工具" },
  { href: "/houses", label: "我的房屋" },
];

export function SiteHeader() {
  const authReady = isSupabaseConfigured();
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(243,246,242,0.82)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="display text-xl font-semibold tracking-tight text-[var(--sage-deep)]">
          家装助手
          <span className="ml-2 text-sm font-normal text-[var(--muted)]">House Builder</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--muted)] md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-[var(--sage)]">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          {authReady ? (
            <Link
              href="/login"
              className="rounded-md bg-[var(--sage)] px-3 py-1.5 text-white transition hover:bg-[var(--sage-deep)]"
            >
              登录
            </Link>
          ) : (
            <span className="rounded-md border border-[var(--line)] px-3 py-1.5 text-[var(--muted)]">
              本地 Demo
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
