"""Render the landing once; Vercel serves only dist/, without a Python server."""
import os
from pathlib import Path
import shutil
import sys
from tempfile import TemporaryDirectory

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from app import create_app


def build_site(output=None, environment=None, config=None):
    output = Path(output or PROJECT_ROOT / "dist").resolve()
    # Rebuild only disposable output, never source directories or external paths.
    build_root = PROJECT_ROOT / "build"
    if output != PROJECT_ROOT / "dist" and not (
        output.is_relative_to(build_root) and output != build_root
    ):
        raise ValueError("A saída deve ser dist/ ou uma subpasta de build/.")

    environment = environment or os.getenv("VERCEL_ENV", "production")
    indexable = environment == "production"
    settings = {
        "TESTING": True,
        "ROBOTS_DIRECTIVE": "index, follow" if indexable else "noindex, nofollow",
    }
    if config:
        settings.update(config)
    app = create_app(settings)
    with app.test_client().get("/") as response:
        if response.status_code != 200:
            raise RuntimeError(f"A landing retornou HTTP {response.status_code}.")
        html = response.get_data(as_text=True)
    if "{%" in html or "{{" in html:
        raise RuntimeError("O HTML ainda contém expressões de template.")

    output.parent.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory(prefix=".landing-", dir=output.parent) as temporary:
        staging = Path(temporary)
        shutil.copytree(
            app.static_folder, staging / "static",
            ignore=shutil.ignore_patterns("__pycache__", "*.pyc", ".*"),
        )
        (staging / "index.html").write_text(html, encoding="utf-8")
        robots = "User-agent: *\n" + ("Allow: /\n" if indexable else "Disallow: /\n")
        (staging / "robots.txt").write_text(robots, encoding="utf-8")
        if output.exists():
            shutil.rmtree(output)
        shutil.copytree(staging, output)

    return output


if __name__ == "__main__":
    destination = build_site()
    print(f"Landing estática gerada em {destination.relative_to(PROJECT_ROOT)}/")
