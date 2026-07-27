"use client";
import { useState } from "react";

export default function ToolsPage() {
  const [area, setArea] = useState("76.34");
  const value = Number(area) || 0;
  return <main><span className="pill">实用工具</span><h1>计价面积计算器</h1>
    <div className="card" style={{ maxWidth: 480 }}><label>合同计价面积（㎡）<input value={area} onChange={e => setArea(e.target.value)} inputMode="decimal" /></label><h2>{value.toFixed(2)} ㎡</h2><p className="muted">请以合同约定的计价口径为准；建筑、套内、赠送和计价面积可能不同。</p></div>
    <div className="grid" style={{ marginTop: "1rem" }}><article className="card"><h2>水平仪</h2><p className="muted">Phase 2 · 设备桥接预留</p></article><article className="card"><h2>LiDAR 测量</h2><p className="muted">Phase 2 · iOS 插件预留</p></article></div>
  </main>;
}
