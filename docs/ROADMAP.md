# Roadmap

## Phase 1 · Seed（当前）

- 多用户 Auth、房屋/方案/原件 RLS 隔离
- Blob 上传、本地 OCR 草稿、人工 JSON 校对入库
- 公开 AEs/A5s Demo、价格与 33 项配置对比
- TermHint、Wiki、品牌品类与档次参考
- 未命中品牌/名词经外部 provider 规范化后持久化
- 计价面积计算器

## Phase 1.1 · Hardening

- 私有 Blob 与 worker 短期签名下载 URL
- enrichment 按用户限流、来源引用、编辑审核和回滚
- OCR 可视化字段校对、图片框选及幂等事务确认
- RLS 集成测试（两个真实 Auth JWT）与审计告警
- 数据导出、账户删除和内容保留策略

## Phase 2 · Site tools

- 实现 `device-bridge` iOS adapter
- ARKit LiDAR 房间扫描、测距与水平仪
- CAD 图层、尺寸标注和方案关联
- OCR 版式模型与本地 GPU 批处理队列

## Phase 3 · Community

- 公共词条修订建议与可信编辑者审核
- 品牌系列级目录、地区与时间维度
- 脱敏方案分享、评论与装修公司响应

档次标签必须始终展示为参考，不构成质量保证；社区内容上线前需建立来源、
申诉、审核和反商业操纵机制。
