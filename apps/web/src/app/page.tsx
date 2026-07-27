import Link from "next/link";
import { DEMO_COMPARE_URL } from "@/lib/demo";

const features = [
  {
    title: "方案结构化",
    desc: "上传报价长图/PDF 存 Vercel Blob，本地 OCR 产出草稿，校对后结构化入库，按房屋隔离。",
    href: "/houses",
    cta: "管理我的房屋",
  },
  {
    title: "多方案对比",
    desc: "总价拆解 + 逐项配置差异，名词悬停即释义，一键复制 Markdown/JSON 给 AI 追问。",
    href: DEMO_COMPARE_URL,
    cta: "看示例对比",
  },
  {
    title: "名词 Wiki",
    desc: "门套、强弱电、计价面积……业主视角的一句话释义与长文，公共词条全员复用。",
    href: "/wiki",
    cta: "逛名词 Wiki",
  },
  {
    title: "品牌档次库",
    desc: "入门/主流/一线/高端四档标注；库里没有的品牌，外搜补全后持久化，下次直接命中。",
    href: "/brands",
    cta: "查品牌档次",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-14 py-8">
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <p className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-medium text-emerald-700">
          种子一期 · 多用户 · Next.js + Supabase + Vercel Blob
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          看懂装修报价，
          <br className="sm:hidden" />
          从<span className="text-emerald-600">结构化对比</span>开始
        </h1>
        <p className="mx-auto max-w-xl text-base leading-7 text-stone-600">
          把装修公司的套餐长图变成可对比的结构化数据：总价拆解、配置差异、品牌档次、名词释义，
          一站看清「贵在哪、值不值」。
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={DEMO_COMPARE_URL}
            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            免登录试玩：AEs vs A5s 示例对比
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            注册并上传我的方案
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h2 className="text-lg font-semibold text-stone-900">{f.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{f.desc}</p>
            </div>
            <Link href={f.href} className="mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-800">
              {f.cta} →
            </Link>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 text-sm leading-6 text-stone-600">
        <h2 className="text-base font-semibold text-stone-900">这一期怎么工作</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>注册登录，创建房屋（售卖面积 ≠ 计价面积，我们分开记）。</li>
          <li>上传方案原件到 Vercel Blob；本地 OCR worker 解析出草稿，网页校对后写入数据库。</li>
          <li>在对比页并排看两套方案：价差拆解、配置差异、名词悬停释义。</li>
          <li>碰到库里没有的品牌/名词？系统自动外搜补全并沉淀为公共词条，所有用户复用。</li>
        </ol>
      </section>
    </div>
  );
}
