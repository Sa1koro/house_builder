import Link from "next/link";
import { DEMO_A5S_ID, DEMO_AES_ID, DEMO_HOUSE_ID } from "@/lib/local-store";

export default function HomePage() {
  const compareHref = `/houses/${DEMO_HOUSE_ID}/compare?a=${DEMO_AES_ID}&b=${DEMO_A5S_ID}`;

  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl border border-[var(--line)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(20,34,28,0.72), rgba(30,74,55,0.45)), url('/hero-grain.svg')",
          }}
        />
        <div className="relative px-6 py-16 text-white md:px-12 md:py-24">
          <p className="fade-up display text-4xl font-semibold tracking-tight md:text-6xl">
            家装助手
          </p>
          <h1 className="fade-up-delay mt-4 max-w-xl text-xl font-medium text-white/90 md:text-2xl">
            把装修方案结构化，一眼看清价差与品牌档次。
          </h1>
          <p className="fade-up-delay-2 mt-3 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
            上传自家方案、对比套餐、查名词与供应商——公共 Wiki/品牌库跨用户沉淀。
          </p>
          <div className="fade-up-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href={compareHref}
              className="rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[var(--sage-deep)] transition hover:bg-[var(--lime-mist)]"
            >
              打开 Demo 对比（AEs vs A5s）
            </Link>
            <Link
              href="/brands"
              className="rounded-md border border-white/40 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
            >
              浏览品牌库
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-8 md:grid-cols-3">
        {[
          {
            title: "方案对比",
            body: "总价拆解 + 配置差异，名词悬停即查。",
            href: compareHref,
          },
          {
            title: "Wiki / 品牌",
            body: "公共知识可复用；冷启动外搜后持久化。",
            href: "/wiki",
          },
          {
            title: "OCR 校对",
            body: "本地模型解析长图，Web 校对后入库。",
            href: "/ingest/review",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group border-t border-[var(--line)] pt-4 transition hover:border-[var(--sage)]"
          >
            <h2 className="display text-xl font-semibold group-hover:text-[var(--sage)]">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{item.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
