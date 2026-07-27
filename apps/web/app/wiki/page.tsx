import Link from "next/link";
import { demoTerms } from "@/lib/demo";

export default function WikiPage() {
  return <main><span className="pill">公共知识库</span><h1>装修 Wiki</h1><p className="muted">术语由种子和受信任补全流程维护，所有用户可读。</p>
    <div className="grid">{Object.entries(demoTerms).map(([slug, term]) => <Link className="card" href={`/wiki/${slug}`} key={slug}><h2>{term.title}</h2><p>{term.summary}</p></Link>)}</div>
  </main>;
}
