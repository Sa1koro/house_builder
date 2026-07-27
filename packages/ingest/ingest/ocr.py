"""OCR 引擎适配：优先 PaddleOCR（中文效果好），退化到 tesseract（chi_sim）。

两者都不可用时抛错，提示用 --text 传入已有文本（例如手动转录/其他工具产出）。
"""

from __future__ import annotations

from pathlib import Path


class OcrUnavailableError(RuntimeError):
    pass


def _try_paddle(image_path: Path) -> list[str] | None:
    try:
        from paddleocr import PaddleOCR  # type: ignore[import-not-found]
    except ImportError:
        return None
    ocr = PaddleOCR(use_angle_cls=True, lang="ch", show_log=False)
    result = ocr.ocr(str(image_path), cls=True)
    lines: list[str] = []
    for page in result or []:
        for entry in page or []:
            # entry: [box, (text, confidence)]
            text = entry[1][0].strip()
            if text:
                lines.append(text)
    return lines


def _try_tesseract(image_path: Path) -> list[str] | None:
    try:
        import pytesseract  # type: ignore[import-not-found]
        from PIL import Image  # type: ignore[import-not-found]
    except ImportError:
        return None
    try:
        raw = pytesseract.image_to_string(Image.open(image_path), lang="chi_sim")
    except pytesseract.TesseractNotFoundError as exc:  # type: ignore[attr-defined]
        raise OcrUnavailableError("已装 pytesseract 但找不到 tesseract 可执行文件（apt install tesseract-ocr tesseract-ocr-chi-sim）") from exc
    return [ln.strip() for ln in raw.splitlines() if ln.strip()]


def run_ocr(image_path: Path, engine: str = "auto") -> list[str]:
    """返回按阅读顺序排列的文本行。engine: auto | paddle | tesseract"""
    if engine in ("auto", "paddle"):
        lines = _try_paddle(image_path)
        if lines is not None:
            return lines
        if engine == "paddle":
            raise OcrUnavailableError("未安装 paddleocr（pip install 'house-builder-ingest[paddle]'）")
    if engine in ("auto", "tesseract"):
        lines = _try_tesseract(image_path)
        if lines is not None:
            return lines
        if engine == "tesseract":
            raise OcrUnavailableError("未安装 pytesseract/Pillow（pip install 'house-builder-ingest[tesseract]'）")
    raise OcrUnavailableError(
        "没有可用的 OCR 引擎。安装 paddleocr 或 pytesseract，"
        "或用 --text your.txt 直接提供已转录文本。"
    )
