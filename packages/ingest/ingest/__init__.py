"""house_builder 本地 OCR ingest worker。

重 OCR 不进 Vercel Serverless：在开发机/自建 worker 上跑，
产出 draft Proposal JSON 推回 Web API，人工校对后入库。
"""

__version__ = "0.1.0"
