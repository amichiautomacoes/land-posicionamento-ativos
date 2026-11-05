
"""Version public assets using their own modification time."""
from pathlib import Path
from flask import current_app, url_for


def static_url(filename):
    root = Path(current_app.static_folder).resolve()
    asset = (root / filename).resolve()
    if not asset.is_relative_to(root):
        raise ValueError("Asset must be inside the public static directory")
    return url_for("static", filename=filename, v=asset.stat().st_mtime_ns)
