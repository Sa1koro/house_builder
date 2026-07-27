# 装修辅助 · 产品路线图

## Phase 1（当前种子）✅

- [x] Next.js + Supabase Auth/RLS + Vercel Blob
- [x] 方案结构化 schema + Demo AEs/A5s（76.34㎡）
- [x] 对比页：总价拆解、配置差异、TermHint 悬停
- [x] Wiki / 品牌库 + enrich 冷启动持久化
- [x] 本地 OCR worker 最小闭环（上传 → draft → 校对入库）
- [x] `device-bridge` stub

## Phase 2 — 设备与空间

- [ ] iOS `device-bridge` 实现：ARKit 测距、水平仪
- [ ] LiDAR 房间扫描 → 户型草图导入
- [ ] CAD 图板：标注尺寸、导出 PDF

## Phase 3 — 识别与编辑

- [ ] PaddleOCR / 版面分析提升任意装修公司长图识别率
- [ ] 社区 Wiki / 品牌编辑与审核流
- [ ] 方案版本 diff、评论与分享链接

## Phase 4 — 协作与商业化

- [ ] 设计师/监理只读协作角色
- [ ] 门店白标部署、多租户计费
- [ ] 与 ERP/供应链报价单对接

## 技术债

- Enrich：接入真实 Search / LLM API（当前 mock + 启发式）
- 对比页：完整 CONFIGS 行项（当前 seed 为关键差异子集）
- E2E 测试与 CI
