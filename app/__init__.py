"""Application factory for the Ativos landing page."""
from flask import Flask
from .config import load_config
from .routes import pages
from .template_helpers import static_url


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_mapping(load_config())
    if test_config:
        app.config.update(test_config)
    app.jinja_env.globals["static_url"] = static_url
    app.register_blueprint(pages)
    return app
