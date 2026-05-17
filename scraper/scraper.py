"""
計装士1級 過去問収集スクリプト

使い方:
  pip install -r requirements.txt
  python scraper.py

出力: output/questions_scraped.json
"""

import json
import re
import time
import urllib.request
from pathlib import Path

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False

try:
    import pdfplumber
    HAS_PDF = True
except ImportError:
    HAS_PDF = False

OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

# 公式PDF URL パターン（年度別）
OFFICIAL_PDF_URLS = [
    ("2024", "https://www.keiso.or.jp/files/2024-1-a.pdf"),
    ("2023", "https://www.keiso.or.jp/files/2023-1-a.pdf"),
    ("2022", "https://www.keiso.or.jp/files/2022-1-a.pdf"),
]


def download_file(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            dest.write_bytes(resp.read())
        print(f"  Downloaded: {dest.name}")
        return True
    except Exception as e:
        print(f"  Failed ({url}): {e}")
        return False


def extract_questions_from_pdf(pdf_path: Path, year: int) -> list[dict]:
    """PDFから問題を抽出して構造化する（簡易パーサー）"""
    if not HAS_PDF:
        print("  pdfplumber not installed. Run: pip install pdfplumber")
        return []

    questions = []
    with pdfplumber.open(pdf_path) as pdf:
        full_text = "\n".join(page.extract_text() or "" for page in pdf.pages)

    # 「問○」パターンで問題を分割（例: 問1, 問２）
    blocks = re.split(r"(?=問\s*[0-9０-９]+[\s　])", full_text)
    for block in blocks:
        block = block.strip()
        if not block or not re.match(r"問\s*[0-9０-９]+", block):
            continue

        # 選択肢パターン検索（① ② ③ ④ or ア イ ウ エ or 1. 2. 3. 4.）
        choices = re.findall(r"[①②③④]\s*(.+?)(?=[①②③④]|$)", block, re.DOTALL)
        if len(choices) != 4:
            continue

        question_text = re.sub(r"問\s*[0-9０-９]+\s*", "", block.split("①")[0]).strip()

        questions.append({
            "id": f"pdf_{year}_{len(questions)+1:03d}",
            "year": year,
            "subject": "計装一般",  # PDF解析では科目自動判定が困難なため要手動修正
            "text": question_text,
            "choices": [c.strip() for c in choices[:4]],
            "answer": 0,           # 正解は要手動入力
            "explanation": ""
        })

    return questions


def scrape_quiz_site() -> list[dict]:
    """nanashi-kuchinashi.com の計装クイズを収集"""
    if not HAS_BS4:
        print("  beautifulsoup4 not installed. Run: pip install beautifulsoup4")
        return []

    base_url = "https://nanashi-kuchinashi.com/keisou_qa000/"
    questions = []

    try:
        req = urllib.request.Request(base_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"  サイト取得失敗: {e}")
        return []

    soup = BeautifulSoup(html, "html.parser")

    # ページ内のクイズリンクを収集
    links = [
        a["href"] for a in soup.find_all("a", href=True)
        if "keisou_qa" in a["href"]
    ]
    links = list(dict.fromkeys(links))  # 重複除去
    print(f"  クイズページ {len(links)} 件発見")

    for url in links[:30]:  # 最大30ページ
        time.sleep(1)
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                page_html = resp.read().decode("utf-8", errors="replace")
        except Exception as e:
            print(f"    スキップ ({url}): {e}")
            continue

        page_soup = BeautifulSoup(page_html, "html.parser")

        # 問題文と選択肢を抽出（サイト構造に合わせて調整が必要な場合あり）
        entry = page_soup.find("div", class_=re.compile(r"entry-content|post-content|article"))
        if not entry:
            continue

        text_blocks = [p.get_text(strip=True) for p in entry.find_all("p") if p.get_text(strip=True)]
        if len(text_blocks) < 5:
            continue

        question_text = text_blocks[0]
        choices_raw = text_blocks[1:5]

        # 「①〜」「ア〜」などの先頭記号を除去
        choices = [re.sub(r"^[①②③④アイウエ\d][\.．、\s　]*", "", c).strip() for c in choices_raw]

        if any(len(c) < 2 for c in choices):
            continue

        questions.append({
            "id": f"site_{len(questions)+1:04d}",
            "year": 0,
            "subject": "計装一般",
            "text": question_text,
            "choices": choices[:4],
            "answer": 0,       # 正解は解説から要確認
            "explanation": text_blocks[5] if len(text_blocks) > 5 else ""
        })

    return questions


def main():
    all_questions: list[dict] = []

    print("=== 公式PDF ダウンロード ===")
    for year_str, url in OFFICIAL_PDF_URLS:
        dest = OUTPUT_DIR / f"official_{year_str}.pdf"
        if not dest.exists():
            download_file(url, dest)
        else:
            print(f"  {dest.name} は既存のためスキップ")

        if dest.exists():
            print(f"  PDFから問題抽出中: {dest.name}")
            qs = extract_questions_from_pdf(dest, int(year_str))
            print(f"  → {len(qs)} 問抽出")
            all_questions.extend(qs)

    print("\n=== クイズサイト スクレイピング ===")
    site_qs = scrape_quiz_site()
    print(f"  → {len(site_qs)} 問取得")
    all_questions.extend(site_qs)

    out_path = OUTPUT_DIR / "questions_scraped.json"
    out_path.write_text(json.dumps(all_questions, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\n完了: 合計 {len(all_questions)} 問 → {out_path}")
    print("\n注意: answer（正解番号）は手動で確認・入力が必要です。")
    print("整形後、app/src/data/questions.json に統合してください。")


if __name__ == "__main__":
    main()
