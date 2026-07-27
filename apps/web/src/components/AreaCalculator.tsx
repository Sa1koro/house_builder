"use client";

import { useState } from "react";

export function AreaCalculator() {
  const [area, setArea] = useState(76.34);

  const over = Math.max(0, area - 50);
  const aes = 65000 + over * 699 + 13000;
  const a5s = 75800 + over * 799 + 13000;

  return (
    <div className="space-y-4 max-w-md">
      <p className="text-sm text-[var(--muted)]">
        圣都 50≤计价面积&lt;80 档快速估算（与 Demo 公式一致）
      </p>
      <div>
        <label className="block text-sm mb-1">计价面积 ㎡</label>
        <input
          type="number"
          step="0.01"
          value={area}
          onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div className="text-sm space-y-1 bg-gray-50 p-3 rounded-lg">
        <div>AEs 颗粒板基础价：¥{aes.toLocaleString()}</div>
        <div>A5s 颗粒板基础价：¥{a5s.toLocaleString()}</div>
        <div>差额：¥{(a5s - aes).toLocaleString()}</div>
      </div>
    </div>
  );
}
