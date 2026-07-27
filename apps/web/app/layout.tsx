import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "筑家 | 装修方案助手",
  description: "对比装修方案、查品牌和装修名词。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>
    <nav className="nav">
      <Link href="/"><strong>筑家</strong></Link>
      <Link href="/demo/compare">示例对比</Link><Link href="/brands">品牌库</Link><Link href="/wiki">装修 Wiki</Link><Link href="/tools">工具</Link>
      <Link className="button" href="/login">登录</Link>
    </nav>
    {children}
  </body></html>;
}
