import { AreaCalculator } from "@/components/AreaCalculator";

export default function ToolsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">工具</h1>
        <p className="mt-1 text-sm text-stone-500">第一期可用：计价面积计算器；传感器类工具在 Phase 2 由 device-bridge 提供</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-stone-900">计价面积计算器</h2>
        <AreaCalculator />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-stone-900">量房工具（Phase 2）</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: "激光测距", desc: "ARKit / 外设测距，量房数据直接入库" },
            { name: "水平仪", desc: "CoreMotion / DeviceOrientation，验收贴砖与吊顶" },
            { name: "LiDAR 扫描", desc: "Apple LiDAR 点云，导出户型供 CAD 图板" },
          ].map((t) => (
            <div
              key={t.name}
              className="cursor-not-allowed select-none rounded-2xl border border-stone-200 bg-stone-100/70 p-5 opacity-60"
              title="Phase 2：packages/device-bridge 提供 iOS 插件接口"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-500">{t.name}</h3>
                <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] text-stone-500">敬请期待</span>
              </div>
              <p className="mt-2 text-sm text-stone-400">{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400">
          接口已在 <code>packages/device-bridge</code> 占位（capabilities / measureDistance / readLevel / scanRoom），详见 docs/ROADMAP.md。
        </p>
      </section>
    </div>
  );
}
