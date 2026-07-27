import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "装修帮 · house_builder",
  description: "装修方案结构化、套餐对比、品牌档次与装修名词 Wiki",
};

// 全站按请求渲染：所有页面都依赖 Supabase 会话/数据
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <Nav />
        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-xs text-stone-400">
          house_builder · 装修辅助种子一期 · 数据仅供参考，签约以合同为准
        </footer>
      </body>
    </html>
  );
}
