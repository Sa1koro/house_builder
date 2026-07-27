import type { Metadata } from "next";
import { Figtree, Syne } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "家装助手 · House Builder",
  description: "多用户装修方案对比、品牌档次与名词 Wiki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${figtree.variable} ${syne.variable} antialiased`}>
        <SiteHeader />
        <main className="mx-auto min-h-[calc(100vh-57px)] max-w-6xl px-4 py-8 md:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
