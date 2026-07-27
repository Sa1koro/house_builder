import Link from "next/link";

const links = [
  ["方案对比", "/houses/demo-90sqm/compare"],
  ["品牌库", "/brands"],
  ["装修 Wiki", "/wiki"],
  ["工具", "/tools"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f5f3ee]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-[#174c36] text-sm text-[#d8f07a]">
            筑
          </span>
          <span>住有谱</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[#526159] md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-[#174c36]">
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-full border border-[#174c36]/20 px-4 py-2 text-sm font-medium text-[#174c36] transition hover:bg-[#174c36] hover:text-white"
        >
          登录 / 注册
        </Link>
      </div>
    </header>
  );
}
