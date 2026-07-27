import { createDeviceBridge } from "@house-builder/device-bridge";
import { AreaCalculator } from "@/components/AreaCalculator";

export default async function ToolsPage() {
  const bridge = createDeviceBridge();
  const lidarAvailable = await bridge.isAvailable("lidar_scan");
  const levelAvailable = await bridge.isAvailable("level");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">装修工具</h1>

      <section className="card">
        <h2 className="font-semibold mb-3">计价面积计算器</h2>
        <AreaCalculator />
      </section>

      <section className="card opacity-60">
        <h2 className="font-semibold mb-3">设备工具（Phase 2）</h2>
        <ul className="space-y-2 text-sm">
          <li>
            水平仪：{levelAvailable ? "可用" : "暂未接入（device-bridge stub）"}
          </li>
          <li>
            LiDAR 扫描：{lidarAvailable ? "可用" : "暂未接入（device-bridge stub）"}
          </li>
          <li>CAD 图板：暂未接入</li>
        </ul>
      </section>
    </div>
  );
}
