
"""Environment configuration for the landing application."""
import os
from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def load_config():
    load_dotenv(PROJECT_ROOT / ".env")
    return {
        "PORT": int(os.getenv("PORT", "5017")),
        "WHATSAPP_NUMBER": os.getenv("WHATSAPP_NUMBER", ""),
        "TEMPLATES_AUTO_RELOAD": True,
        "SEND_FILE_MAX_AGE_DEFAULT": None,
    }
