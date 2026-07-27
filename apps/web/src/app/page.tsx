import Link from "next/link";
import { DEMO_HOUSE_ID, DEMO_AES_ID, DEMO_A5S_ID } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-[var(--primary)]">
          装修方案对比 · 品牌 Wiki
        </h1>
        <p className="text-[var(--muted)] max-w-2xl mx-auto">
          上传装修公司方案，结构化对比配置与总价；名词悬停释义、品牌档次检索；
          冷启动自动补全并沉淀公共知识库。
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href={`/houses/${DEMO_HOUSE_ID}/compare?a=${DEMO_AES_ID}&b=${DEMO_A5S_ID}`}
            className="btn btn-primary"
          >
            查看 Demo：AEs vs A5s（76.34㎡）
          </Link>
          <Link href="/login" className="btn btn-secondary">
            注册 / 登录
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="font-semibold text-lg mb-2">方案对比</h2>
          <p className="text-sm text-[var(--muted)]">
            多套餐总价拆解、配置差异高亮，一键复制 Markdown 给 AI 分析。
          </p>
        </div>
        <div className="card">
          <h2 className="font-semibold text-lg mb-2">Wiki & 品牌</h2>
          <p className="text-sm text-[var(--muted)]">
            装修名词释义、品牌档次标签；首次未命中自动外搜补全并持久化。
          </p>
        </div>
        <div className="card">
          <h2 className="font-semibold text-lg mb-2">OCR 校对入库</h2>
          <p className="text-sm text-[var(--muted)]">
            原件存 Vercel Blob，本地 OCR worker 产出草稿，Web 校对后写入云端。
          </p>
        </div>
      </section>

      <section className="card bg-[var(--primary-light)]">
        <h2 className="font-semibold mb-2">第一期边界</h2>
        <ul className="text-sm space-y-1 text-gray-700 list-disc list-inside">
          <li>多用户 Auth + RLS 隔离房屋与方案</li>
          <li>公共 Wiki/品牌库全员可读，enrich 冷启动持久化</li>
          <li>本地 OCR 流水线（不把重计算塞进 Serverless）</li>
          <li>CAD / LiDAR / 水平仪仅预留 device-bridge 接口</li>
        </ul>
      </section>
    </div>
  );
}
