import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata = {
  title: "装修辅助 — 方案对比与品牌 Wiki",
  description: "多用户装修方案结构化、对比、Wiki 与品牌库",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Nav />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
