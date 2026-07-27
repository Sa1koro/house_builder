import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg text-[var(--primary)]">
          装修辅助
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/wiki">Wiki</Link>
          <Link href="/brands">品牌库</Link>
          <Link href="/tools">工具</Link>
          <Link href="/houses">我的房屋</Link>
          <Link href="/login" className="btn btn-primary text-sm">
            登录
          </Link>
        </div>
      </nav>
    </header>
  );
}
