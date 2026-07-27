"use client";

import { useState } from "react";
import { demoHouse, demoLines, proposals } from "@/lib/demo-data";

export function CopyButtons() {
  const [copied, setCopied] = useState<string>();
  const copy = async (format: "Markdown" | "JSON") => {
    const data = { house: demoHouse, proposals, lineItems: demoLines };
    const markdown = [
      `# ${demoHouse.name}：AEs vs A5s`,
      `- 计价面积：${demoHouse.pricingArea}㎡`,
      `- AEs 含费预估：${proposals.aes.total} 元`,
      `- A5s 含费预估：${proposals.a5s.total} 元`,
      "",
      "| 空间 | 项目 | AEs | A5s | 结论 |",
      "|---|---|---|---|---|",
      ...demoLines.map((line) => `| ${line.space} | ${line.category} | ${line.aes} | ${line.a5s} | ${line.note} |`),
    ].join("\n");
    await navigator.clipboard.writeText(format === "JSON" ? JSON.stringify(data, null, 2) : markdown);
    setCopied(format);
    window.setTimeout(() => setCopied(undefined), 1600);
  };
  return (
    <div className="flex gap-2">
      {(["Markdown", "JSON"] as const).map((format) => (
        <button key={format} onClick={() => copy(format)} className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:border-[#174c36]/30">
          {copied === format ? "已复制 ✓" : `复制 ${format}`}
        </button>
      ))}
    </div>
  );
}
