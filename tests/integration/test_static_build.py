"""Deployment contracts: the exported landing works without Flask at runtime."""
import os
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch
from urllib.parse import unquote, urlsplit

from scripts.build_static import PROJECT_ROOT, build_site
from test_routes import AssetReferences


class StaticBuildTest(unittest.TestCase):
    def setUp(self):
        (PROJECT_ROOT / "build").mkdir(exist_ok=True)
        self.temporary = TemporaryDirectory(dir=PROJECT_ROOT / "build")
        self.addCleanup(self.temporary.cleanup)
        self.output = Path(self.temporary.name) / "site"
        self.config = {"WHATSAPP_NUMBER": "5511999999999"}

    def test_production_export_contains_page_contacts_and_all_assets(self):
        build_site(self.output, environment="production", config=self.config)
        html = (self.output / "index.html").read_text(encoding="utf-8")
        self.assertIn('content="index, follow"', html)
        self.assertNotIn("{%", html)
        self.assertNotIn("{{", html)
        self.assertEqual(
            {path.name for path in self.output.iterdir()},
            {"index.html", "robots.txt", "static"},
        )
        self.assertEqual(
            (self.output / "robots.txt").read_text(encoding="utf-8"),
            "User-agent: *\nAllow: /\n",
        )
        parser = AssetReferences()
        parser.feed(html)
        self.assertGreater(len(parser.urls), 10)
        for url in parser.urls:
            asset = self.output / unquote(urlsplit(url).path).lstrip("/")
            with self.subTest(asset=asset.relative_to(self.output)):
                self.assertTrue(asset.is_file())
        self.assertEqual(len(parser.contacts), 3)
        for tag, attributes in parser.contacts:
            self.assertEqual(tag, "a")
            self.assertTrue(attributes["href"].startswith("https://wa.me/5511999999999?"))
        # Modules, CSS dependencies and font licenses must accompany the HTML.
        for source in (PROJECT_ROOT / "app/static").rglob("*"):
            if source.is_file():
                relative = source.relative_to(PROJECT_ROOT / "app/static")
                with self.subTest(asset=relative):
                    self.assertEqual((self.output / "static" / relative).read_bytes(), source.read_bytes())

    def test_preview_and_development_are_not_indexable(self):
        for environment in ("preview", "development"):
            with self.subTest(environment=environment), patch.dict(os.environ, {"VERCEL_ENV": environment}):
                build_site(self.output, config=self.config)
                html = (self.output / "index.html").read_text(encoding="utf-8")
                self.assertIn('content="noindex, nofollow"', html)
                self.assertIn("Disallow: /", (self.output / "robots.txt").read_text())

    def test_rebuild_removes_stale_files_and_unconfigured_contacts(self):
        build_site(self.output, environment="production", config=self.config)
        (self.output / "stale.txt").write_text("old export")
        build_site(self.output, environment="production", config={"WHATSAPP_NUMBER": ""})
        self.assertFalse((self.output / "stale.txt").exists())
        html = (self.output / "index.html").read_text(encoding="utf-8")
        self.assertNotIn("https://wa.me/5511999999999", html)
        self.assertEqual(html.count('aria-disabled="true"'), 3)

    def test_export_rejects_source_and_external_destinations(self):
        for destination in (PROJECT_ROOT, PROJECT_ROOT / "app", PROJECT_ROOT / "build", PROJECT_ROOT.parent / "dist"):
            with self.subTest(destination=destination), self.assertRaises(ValueError):
                build_site(destination)


if __name__ == "__main__":
    unittest.main()
