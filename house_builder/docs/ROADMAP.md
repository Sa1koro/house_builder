# ROADMAP

## Phase 1（本仓库 · 已实现种子）

- 多用户 Auth + RLS 隔离房屋/方案
- Demo 公开对比 AEs vs A5s
- Wiki / 品牌库 + enrich 冷启动持久化
- Vercel Blob 上传原件
- 本地 OCR → draft → 校对入库
- device-bridge / CAD / LiDAR **仅占位**

## Phase 2

- **iOS device-bridge**：测距、水平仪、Apple LiDAR → 户型草稿
- CAD 简易图板（墙体/开间标注）
- OCR 版式自适应：多装修公司宣传页/报价单模板库
- 社区编辑审核：Wiki/品牌用户投稿 + 置信度与审核队列
- enrich 多 provider 路由与引用溯源展示
- 对比会话分享链接（只读 token）

## Phase 3

- 签约清单 / 增项追踪
- 门店报价单 PDF 结构化导入
- 多公司跨品牌同品类 TCO 模型
- 自建 GPU OCR worker（可选）替代本机 tesseract
