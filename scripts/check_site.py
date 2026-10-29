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

    if failures:
        print("Static site checks failed:")
        for failure in failures:
            print(f"- {failure}")
        raise SystemExit(1)

    print(f"Static site checks passed for {len(html_files)} root HTML pages.")


if __name__ == "__main__":
    main()
