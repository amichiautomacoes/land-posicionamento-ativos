
"""Public page routes."""
from flask import Blueprint, current_app, render_template
from .services.contact_links import build_whatsapp_url

pages = Blueprint("pages", __name__)


@pages.get("/")
def home():
    return render_template(
        "pages/home.html",
        whatsapp_url=build_whatsapp_url(current_app.config["WHATSAPP_NUMBER"]),
    )
