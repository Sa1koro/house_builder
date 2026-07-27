export function fmtCNY(v: number | null | undefined): string {
  if (v === null || v === undefined) return "—";
  return `¥${v.toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`;
}

export function fmtDiff(v: number): string {
  const s = `¥${Math.abs(v).toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`;
  return v > 0 ? `+${s}` : v < 0 ? `-${s}` : "0";
}

export const OCR_STATUS_LABELS: Record<string, string> = {
  pending: "待解析",
  processing: "解析中",
  draft_ready: "待校对",
  reviewed: "已入库",
  failed: "解析失败",
};
