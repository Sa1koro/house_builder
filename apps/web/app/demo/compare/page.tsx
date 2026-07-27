import { TermHint } from "@/components/term-hint";
import { demoProposals } from "@/lib/demo";

export default function DemoCompare() {
  const [aes, a5s] = demoProposals;
  const delta = aes.total - a5s.total;
  return <main>
    <span className="pill">公开示例 · 76.34㎡</span><h1>AEs 与 A5s 方案对比</h1>
    <p className="muted">未登录即可查看；示例数据来自已校对的报价资料。</p>
    <section className="grid">
      {demoProposals.map(p => <article className="card" key={p.id}><h2>{p.name}</h2><p>{p.company} · 套餐方案</p><h3>¥{p.total.toLocaleString()}</h3><p className="muted">基础：¥{p.base.toLocaleString()} · 升级：¥{p.upgrade.toLocaleString()}</p></article>)}
      <article className="card"><h2>价差</h2><h3 className="difference">¥{delta.toLocaleString()}</h3><p>以 AEs 为高价方案。</p></article>
    </section>
    <h2>配置差异</h2>
    <table><thead><tr><th>空间 / 品类</th><th>AEs</th><th>A5s</th></tr></thead>
      <tbody>{aes.items.map((item, i) => <tr key={item[0] + item[1]}><td>{item[0]} · {item[1]}</td><td>{item[2]}<br /><span className="muted">{item[3]}</span></td><td>{a5s.items[i][2]}<br /><span className="muted">{a5s.items[i][3]}</span></td></tr>)}</tbody>
    </table>
    <p>术语提示：<TermHint slug="门套" />、<TermHint slug="强弱电分离" />、<TermHint slug="西卡" />、<TermHint slug="计价面积" /></p>
  </main>;
}
