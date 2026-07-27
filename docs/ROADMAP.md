# ROADMAP

## 第一期（本仓库现状）· 种子

- [x] Next.js（Vercel）+ Supabase（Auth/Postgres/RLS）+ Vercel Blob 脚手架
- [x] 多用户隔离：houses/proposals/assets 私有，demo 房公开
- [x] Proposal/Brand/Term JSON Schema + AEs/A5s 示例数据（76.34㎡，与 Excel 一致）
- [x] 对比页：总价拆解、配置差异、TermHint 悬停、复制 Markdown/JSON 给 AI
- [x] Wiki（30 词条种子 + 7 篇长文）与品牌库（41 品牌，四档档次）
- [x] 冷启动 enrich：DB miss → 外搜/LLM → upsert 公共表 + enrich_jobs 审计
- [x] 本地 OCR worker（PaddleOCR/tesseract）→ draft → 网页校对入库
- [x] device-bridge 接口占位；/tools 计价面积计算器

## 第二期 · 体验与自动化

- [ ] **校对 UI 升级**：从 JSON textarea 升级为表格化编辑（逐行确认、品牌自动联想到 brands 库）
- [ ] **OCR 提升**：版式模板库（按装修公司），LLM 辅助把 OCR 文本直接结构化为 draft（本地/自建推理）
- [ ] **enrich 审核流**：低置信度条目进待审队列，编辑确认后升级 source=editor
- [ ] **社区编辑**：登录用户可提交词条修订（审核后合并），贡献记录
- [ ] **对比增强**：三方案以上对比、按空间小计、谈判点清单自动生成
- [ ] **OCR 任务队列**：pending 资产的 webhook/轮询派发，worker 常驻模式（Docker 镜像）

## 第三期 · 传感器与图板（device-bridge 落地）

- [ ] iOS 壳（Capacitor/原生）实现 `DeviceBridge`：ARKit 测距、CoreMotion 水平仪
- [ ] Apple LiDAR（RoomPlan）扫描 → 户型 JSON/USDZ 存 Blob → 房屋绑定量房数据
- [ ] CAD 图板：基于量房数据的 2D 平面图查看/标注，装修点位（插座/灯位）叠加
- [ ] 方案 ↔ 户型联动：对比页按房间面积核算单价合理性

## 长期

- [ ] 报价合理性模型：跨用户匿名聚合同城同品类单价分布
- [ ] 装修公司主页与套餐版本追踪（宣传页历史价格）
- [ ] 多语言/多市场
