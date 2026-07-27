import { AreaCalculator } from "./area-calculator";

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#799067]">辅助工具</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">现场与报价工具箱</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <AreaCalculator />
        <div className="space-y-4">
          {[["水平仪", "等待设备传感器桥接", "Phase 2"], ["LiDAR 扫描", "等待 iOS ARKit 插件", "Phase 2"], ["CAD 图板", "方案结构稳定后接入", "Roadmap"]].map(([title, text, phase]) => <article key={title} className="rounded-2xl border border-dashed border-black/15 bg-white/40 p-5 opacity-70"><div className="flex items-center justify-between"><h2 className="font-semibold">{title}</h2><span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px]">{phase}</span></div><p className="mt-2 text-sm text-[#65736b]">{text}</p></article>)}
        </div>
      </div>
    </main>
  );
}
