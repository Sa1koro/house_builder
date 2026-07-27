import Link from "next/link";

export default function Home() {
  return <main>
    <section className="hero"><span className="pill">装修方案结构化助手</span>
      <h1>把报价单变成<br />可对比的选择。</h1>
      <p className="muted">保存你的方案原件，拆开总价和配置差异；查品牌档次与装修名词。</p>
      <p><Link className="button" href="/demo/compare">查看 AEs / A5s 示例</Link></p>
    </section>
    <section className="grid">
      <article className="card"><h2>方案对比</h2><p>总价、空间、品类逐项对照，快速定位价差。</p></article>
      <article className="card"><h2>品牌库</h2><p>品牌档次、别名与来源持续沉淀，可跨用户复用。</p></article>
      <article className="card"><h2>OCR 校对</h2><p>本地 worker 识别原件，确认后才写入你的私有方案。</p></article>
    </section>
  </main>;
}
