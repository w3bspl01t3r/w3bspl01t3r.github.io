#!/usr/bin/env python3
"""Dependency-free checks for the static ZDayLabs site."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent.parent
CORE_PAGES = {
    "index.html",
    "services.html",
    "engagements.html",
    "research.html",
    "blogs.html",
    "contact.html",
    "policy.html",
    "404.html",
}
RESEARCH_PAGES = {
    "CVE-2025-10492.html",
    "CVE-2025-11466.html",
    "CVE-2025-60785.html",
    "CVE-2025-60786.html",
    "CVE-2025-6216.html",
    "CVE-2025-xxxx.html",
}
TECHNICAL_PAGES = {
    "BeanShell1.html",
    "BeanValidationToRce.html",
    "CommonsBeanUtils1.html",
    "CommonsCollection1.html",
    "CommonsCollection2.html",
    "CommonsCollection3.html",
    "CommonsCollection4.html",
    "CommonsCollection5.html",
    "CommonsCollection6.html",
    "CommonsCollection7.html",
    "GPGBypass.html",
    "Groovy1.html",
    "HackingJWT.html",
    "InsecureDeserialization.html",
    "JDBCInjection.html",
    "JNDIToRCE.html",
    "beyondcommoncollections.html",
    "customgadget.html",
    "ysoserial.html",
}
IGNORED_SCHEMES = {"http", "https", "mailto", "tel", "data"}


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.references = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if "id" in attributes:
            self.ids.append(attributes["id"])
        for attribute in ("href", "src"):
            value = attributes.get(attribute)
            if value:
                self.references.append(value)


def resolve_reference(page, reference):
    parsed = urlsplit(reference)
    if parsed.scheme in IGNORED_SCHEMES or reference.startswith("//"):
        return None, None
    if parsed.scheme or reference.startswith("javascript:") or "{{" in reference:
        return None, None

    path_value = unquote(parsed.path)
    if not path_value:
        target = page
    elif path_value.startswith("/"):
        target = ROOT / path_value.lstrip("/")
    else:
        target = page.parent / path_value

    if target.is_dir():
        target = target / "index.html"
    return target.resolve(), unquote(parsed.fragment)


def main():
    failures = []
    parsed_pages = {}
    html_files = sorted(ROOT.glob("*.html"))

    for page in html_files:
        parser = SiteParser()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        parsed_pages[page.resolve()] = parser

        duplicate_ids = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
        if duplicate_ids:
            failures.append(f"{page.name}: duplicate IDs: {', '.join(duplicate_ids)}")

        if page.name in CORE_PAGES:
            content = page.read_text(encoding="utf-8")
            for required in ('id="navigation-placeholder"', 'href="/style.css"', 'src="/navigation.js"'):
                if required not in content:
                    failures.append(f"{page.name}: missing shared shell marker {required}")

        if page.name in RESEARCH_PAGES:
            content = page.read_text(encoding="utf-8")
            for required in ('class="research-article"', 'class="article-header"', 'href="/research.html"'):
                if required not in content:
                    failures.append(f"{page.name}: missing modern research marker {required}")

        if page.name in TECHNICAL_PAGES:
            content = page.read_text(encoding="utf-8")
            for required in (
                'class="technical-article-page"',
                'href="/style.css"',
                'src="/navigation.js"',
            ):
                if required not in content:
                    failures.append(f"{page.name}: missing modern technical-note marker {required}")

    for page_path, parser in parsed_pages.items():
        for reference in parser.references:
            target, fragment = resolve_reference(page_path, reference)
            if target is None:
                continue
            if not target.exists():
                failures.append(f"{page_path.name}: missing local target {reference}")
                continue
            if fragment and target.suffix.lower() == ".html":
                target_parser = parsed_pages.get(target)
                if target_parser is None:
                    target_parser = SiteParser()
                    target_parser.feed(target.read_text(encoding="utf-8", errors="replace"))
                    parsed_pages[target] = target_parser
                if fragment not in target_parser.ids:
                    failures.append(f"{page_path.name}: missing fragment target {reference}")

    for content_file in sorted(ROOT.rglob("*")):
        if content_file.suffix.lower() not in {".html", ".md"} or ".git" in content_file.parts:
            continue
        content = content_file.read_text(encoding="utf-8", errors="replace")
        dash_forms = ("—", "–", "&mdash;", "&ndash;", "&#8212;", "&#8211;", "&#x2014;", "&#x2013;")
        if any(dash_form in content for dash_form in dash_forms):
            failures.append(f"{content_file.relative_to(ROOT)}: contains an em dash or en dash")

    if failures:
        print("Static site checks failed:")
        for failure in failures:
            print(f"- {failure}")
        raise SystemExit(1)

    print(f"Static site checks passed for {len(html_files)} root HTML pages.")


if __name__ == "__main__":
    main()
