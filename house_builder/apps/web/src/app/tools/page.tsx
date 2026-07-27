import { DEVICE_BRIDGE_CAPABILITIES } from "@house-builder/device-bridge";
import { AreaCalculator } from "@/components/area-calculator";

export default function ToolsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="display text-3xl font-semibold">工具</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          计价面积计算器可用；测距 / 水平仪 / LiDAR 为 Phase 2 占位。
        </p>
      </div>

      <AreaCalculator />

      <section>
        <h2 className="display text-xl font-semibold">设备桥接（灰显）</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {DEVICE_BRIDGE_CAPABILITIES.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-[var(--line)] bg-white/40 px-4 py-3 opacity-55"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.label}</span>
                <span className="text-xs text-[var(--muted)]">Phase {c.phase}</span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">即将推出 · device-bridge stub</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
