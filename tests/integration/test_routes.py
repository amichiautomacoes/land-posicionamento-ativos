"""HTTP contracts affected by the project reorganization."""
import unittest
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

from app import create_app


class AssetReferences(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()
        self.contacts = []

    def handle_starttag(self, tag, attributes):
        values = dict(attributes)
        if {"hero-whatsapp", "button-whatsapp", "faq-support"}.intersection(values.get("class", "").split()):
            self.contacts.append((tag, values))
        names = ("src", "poster", "data-desktop-poster", "data-mobile-poster")
        if tag in {"link", "use"}:
            names += ("href",)
        for name in names:
            value = values.get(name, "")
            if value.startswith("/static/"):
                self.urls.add(value.split("#")[0])
        for candidate in values.get("srcset", "").split(","):
            parts = candidate.split()
            if parts and parts[0].startswith("/static/"):
                self.urls.add(parts[0])


class LandingRoutesTest(unittest.TestCase):
    def setUp(self):
        self.app = create_app({"TESTING": True, "WHATSAPP_NUMBER": ""})
        self.client = self.app.test_client()

    def test_homepage_and_unconfigured_contact(self):
        with self.client.get("/") as response:
            html = response.get_data(as_text=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn('<html lang="pt-BR">', html)
        self.assertIn('data-design-system="ativos"', html)
        self.assertIn('<script type="module"', html)
        self.assertIn('content="noindex, nofollow"', html)
        self.assertEqual(html.count('aria-disabled="true"'), 3)
        self.assertNotIn('href="https://wa.me/', html)
        parser = AssetReferences()
        parser.feed(html)
        self.assertEqual(len(parser.contacts), 3)
        for tag, attributes in parser.contacts:
            self.assertEqual(tag, "button")
            self.assertIn("disabled", attributes)
            self.assertNotIn("href", attributes)
            self.assertNotIn("role", attributes)

    def test_configured_contact_is_a_native_external_link(self):
        app = create_app({"TESTING": True, "WHATSAPP_NUMBER": "5511999999999"})
        with app.test_client().get("/") as response:
            html = response.get_data(as_text=True)
        parser = AssetReferences()
        parser.feed(html)
        self.assertEqual(len(parser.contacts), 3)
        for tag, attributes in parser.contacts:
            self.assertEqual(tag, "a")
            self.assertTrue(attributes["href"].startswith("https://wa.me/5511999999999?"))
            self.assertEqual(attributes["target"], "_blank")
            self.assertIn("noopener", attributes["rel"])
            self.assertNotIn("disabled", attributes)
        self.assertEqual(html.count("(abre em nova aba)"), 3)

    def test_all_published_references_exist(self):
        parser = AssetReferences()
        with self.client.get("/") as response:
            parser.feed(response.get_data(as_text=True))
        self.assertGreater(len(parser.urls), 10)
        for url in sorted(parser.urls):
            with self.subTest(url=url), self.client.get(url) as response:
                self.assertEqual(response.status_code, 200)

    def test_hero_videos_support_partial_requests(self):
        urls = [
            "/static/videos/hero/desktop.mp4",
            "/static/videos/hero/mobile.mp4",
        ]
        for url in urls:
            with self.subTest(url=url), self.client.get(
                url, headers={"Range": "bytes=0-31"}
            ) as response:
                self.assertEqual(response.status_code, 206)
                self.assertEqual(response.mimetype, "video/mp4")
                self.assertEqual(len(response.data), 32)
                self.assertTrue(response.headers["Content-Range"].startswith("bytes 0-31/"))

    def test_public_media_and_fonts_are_referenced(self):
        parser = AssetReferences()
        with self.client.get("/") as response:
            parser.feed(response.get_data(as_text=True))
        referenced = {urlsplit(url).path.removeprefix("/static/") for url in parser.urls}
        static = Path(self.app.static_folder).resolve()
        for stylesheet in (static / "css").rglob("*.css"):
            for filename in re.findall(r"url\(['\"]?([^)'\"]+)", stylesheet.read_text(encoding="utf-8")):
                if not filename.startswith("data:"):
                    referenced.add((stylesheet.parent / filename).resolve().relative_to(static).as_posix())
        unused = []
        for directory in ("images", "fonts", "videos"):
            for asset in (static / directory).rglob("*"):
                if asset.is_file() and asset.suffix != ".txt":
                    if asset.relative_to(static).as_posix() not in referenced:
                        unused.append(asset.relative_to(static).as_posix())
        self.assertEqual(unused, [], "Published media must be used by the page or CSS")

    def test_internal_documents_and_originals_are_not_public_assets(self):
        for url in ("/docs/content/faq.md", "/design/originals/services/productivity-imagen.png"):
            with self.subTest(url=url), self.client.get(url) as response:
                self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
