# demo-90sqm · 公开示例房

圣都整装 AEs vs A5s 硬装全案对比（售卖 90㎡ / 计价 76.34㎡，杭州）。

- `house.json` / `proposal-aes.json` / `proposal-a5s.json` — 结构化数据（符合 `packages/schema/schemas/proposal.schema.json`），由 `packages/supabase/scripts/build-seed.mjs` 同步进 `seed.sql`，ID 固定，未登录可在网页浏览对比。
- `source/` — 原始素材：宣传长图两张、人工核对过的 Excel（`AEs_vs_A5s_硬装对比_76.34㎡.xlsx`）、当年的提取脚本（`extract_brochure_to_xlsx.py`，数据单一来源）。

关键数字（与 Excel 一致）：

| | AEs | A5s | 差额 |
| --- | ---: | ---: | ---: |
| 全案基础价（颗粒板，不含管理费） | 96,411.66 | 109,845.66 | +13,434.00 |
| 含费预估（+管理费12%+经理费2%） | 108,089.29 | 123,404.05 | +15,314.76 |

修改这些 JSON 后运行 `pnpm seed:build` 重新生成 seed.sql。
