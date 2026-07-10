#!/usr/bin/env python3
"""Validate a self-contained HTML web presentation without third-party packages."""

from __future__ import annotations

import argparse
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse


PLACEHOLDER_PATTERNS = (
    r"TODO",
    r"FIXME",
    r"\(改我\)",
    r"（改我）",
    r"lorem ipsum",
    r"example\.com",
)


class DeckParser(HTMLParser):
    VOID_TAGS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.slides = 0
        self.active_slides = 0
        self.slide_heading_counts: list[int] = []
        self._in_slide = False
        self._slide_depth = 0
        self.images: list[tuple[str, str | None]] = []
        self.ids: list[str] = []
        self.document_title = ""
        self._in_title = False
        self.html_lang = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        classes = set((values.get("class") or "").split())
        if tag == "html":
            self.html_lang = values.get("lang") or ""
        if values.get("id"):
            self.ids.append(values["id"] or "")
        if tag == "title":
            self._in_title = True
        if tag == "section" and "slide" in classes:
            self.slides += 1
            self.active_slides += int("active" in classes)
            self.slide_heading_counts.append(0)
            self._in_slide = True
            self._slide_depth = 1
        elif self._in_slide and tag not in self.VOID_TAGS:
            self._slide_depth += 1
        if self._in_slide and tag in {"h1", "h2"}:
            self.slide_heading_counts[-1] += 1
        if tag == "img":
            self.images.append((values.get("src") or "", values.get("alt")))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if self._in_slide:
            self._slide_depth -= 1
            if self._slide_depth <= 0:
                self._in_slide = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.document_title += data


def local_asset_path(html_path: Path, src: str) -> Path | None:
    parsed = urlparse(src)
    if not src or src.startswith("data:") or parsed.scheme in {"http", "https"}:
        return None
    clean = unquote(parsed.path).lstrip("/")
    return (html_path.parent / clean).resolve()


def validate(path: Path, strict: bool) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    if not path.is_file():
        return [f"找不到 HTML：{path}"], warnings

    text = path.read_text(encoding="utf-8")
    parser = DeckParser()
    try:
        parser.feed(text)
    except Exception as exc:
        return [f"HTML 無法解析：{exc}"], warnings

    if "<!doctype html" not in text.lower():
        errors.append("缺少 <!doctype html>。")
    if "name=\"viewport\"" not in text and "name='viewport'" not in text:
        errors.append("缺少 viewport 設定。")
    if not parser.html_lang:
        warnings.append("<html> 沒有 lang 屬性。")
    if not parser.document_title.strip():
        errors.append("<title> 是空的。")
    if parser.slides < 5:
        errors.append(f"只有 {parser.slides} 頁；網頁簡報至少應有 5 頁。")
    if parser.active_slides != 1:
        errors.append(f"需要且只能有 1 個 `.slide.active`，目前為 {parser.active_slides}。")
    missing_headings = [str(i + 1) for i, count in enumerate(parser.slide_heading_counts) if count == 0]
    if missing_headings:
        warnings.append("以下頁面沒有 h1/h2 標題：" + ", ".join(missing_headings))

    duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
    if duplicates:
        errors.append("重複 id：" + ", ".join(duplicates))

    for index, (src, alt) in enumerate(parser.images, start=1):
        if not src:
            errors.append(f"第 {index} 張圖片缺少 src。")
            continue
        if alt is None or not alt.strip():
            errors.append(f"圖片 `{src}` 缺少有意義的 alt。")
        parsed = urlparse(src)
        if parsed.scheme in {"http", "https"}:
            warnings.append(f"圖片使用遠端網址，離線時可能失效：{src}")
            continue
        asset = local_asset_path(path, src)
        if asset is not None and not asset.is_file():
            errors.append(f"圖片檔不存在：{src}")

    for pattern in PLACEHOLDER_PATTERNS:
        if re.search(pattern, text, flags=re.IGNORECASE):
            warnings.append(f"仍有疑似佔位內容：{pattern}")

    required_markers = {
        "進度條 `.progress-bar`": "progress-bar",
        "上一頁按鈕 `.prev`": 'class="nav-btn prev"',
        "下一頁按鈕 `.next`": 'class="nav-btn next"',
        "頁碼 `.counter`": 'class="counter"',
        "減少動態支援": "prefers-reduced-motion",
        "投影片控制程式": "querySelectorAll('.slide')",
    }
    for label, marker in required_markers.items():
        if marker not in text:
            errors.append(f"缺少{label}。")

    if "overflow-x" not in text and "overflow:hidden" not in text.replace(" ", ""):
        warnings.append("未看見橫向溢出防護，請檢查窄螢幕。")

    if strict and warnings:
        errors.extend(f"嚴格模式：{item}" for item in warnings)
        warnings = []
    return errors, warnings


def main() -> int:
    argp = argparse.ArgumentParser(description="檢查動態網頁 PPT 的結構與本地素材。")
    argp.add_argument("html", type=Path, help="要檢查的 index.html")
    argp.add_argument("--strict", action="store_true", help="把警告視為錯誤")
    args = argp.parse_args()

    errors, warnings = validate(args.html.resolve(), args.strict)
    for item in warnings:
        print(f"[WARN] {item}")
    for item in errors:
        print(f"[ERROR] {item}")
    if errors:
        print(f"檢查失敗：{len(errors)} 個錯誤。")
        return 1
    print("檢查通過：HTML 結構、導航標記與本地圖片引用正常。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
