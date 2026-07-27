"""OCR 文本行 → draft Proposal JSON（对应 packages/schema/schemas/proposal.schema.json）。

第一期目标是「草稿 + 人工校对」，不追求全自动识别任意版式：
- 尽力抽取公司/套餐名、价格项、空间-品类-品牌行
- 无法归类的行保留在 notes 里带 [OCR] 前缀，校对页可见、可删
"""

from __future__ import annotations

import re
from typing import Any

SPACES = ["客餐厅", "客厅", "餐厅", "厨房", "卧室", "主卧", "次卧", "阳台", "卫生间", "辅材", "其它工程", "其他工程", "售后", "全屋"]

PRICE_HINTS = [
    ("硬装基础", "hard_base"),
    ("超面积", "over_area"),
    ("颗粒板", "custom_particle"),
    ("实木芯", "custom_solid"),
    ("管理费", "mgmt_fee"),
    ("项目经理", "pm_fee"),
]

AMOUNT_RE = re.compile(r"(?<![\d.])(\d{3,7}(?:\.\d{1,2})?)(?:\s*元)?(?![\d.])")


def _find_amount(line: str) -> float | None:
    m = AMOUNT_RE.search(line.replace(",", ""))
    return float(m.group(1)) if m else None


def build_draft(lines: list[str], source_note: str = "") -> dict[str, Any]:
    company = "待校对"
    package_name = "待校对"
    for ln in lines[:15]:
        if "圣都" in ln:
            company = "圣都整装"
        m = re.search(r"\b(A\d?[Ees]s?|AEs|A5s)\b", ln)
        if m:
            package_name = m.group(1)

    pricing_items: list[dict[str, Any]] = []
    line_items: list[dict[str, Any]] = []
    leftovers: list[str] = []

    for ln in lines:
        matched = False
        for hint, key in PRICE_HINTS:
            if hint in ln:
                amount = _find_amount(ln)
                if amount is not None and not any(i["key"] == key for i in pricing_items):
                    pricing_items.append({"key": key, "label": ln[:30], "amount": amount, "note": "OCR 提取，待校对"})
                    matched = True
                    break
        if matched:
            continue

        space = next((s for s in SPACES if ln.startswith(s)), None)
        if space:
            rest = ln[len(space):].strip(" :：-·")
            # 常见版式：品类 品牌1/品牌2/品牌3
            parts = rest.split(None, 1)
            category = parts[0] if parts else rest or "待校对"
            brands = [b for b in re.split(r"[/、,，]", parts[1]) if b.strip()] if len(parts) > 1 else []
            line_items.append({
                "space": space,
                "category": category,
                "brands": [b.strip() for b in brands],
                "note": "OCR 提取，待校对",
            })
            continue

        if len(ln) >= 4:
            leftovers.append(ln)

    draft: dict[str, Any] = {
        "company": company,
        "package_name": package_name,
        "version": "OCR draft",
        "pricing": {"currency": "CNY", "items": pricing_items},
        "line_items": line_items or [
            {"space": "待校对", "category": "待校对", "brands": [], "note": "OCR 未识别出配置行，请对照原件手工填写"}
        ],
        "notes": ([source_note] if source_note else []) + [f"[OCR] {ln}" for ln in leftovers[:60]],
    }
    return draft
