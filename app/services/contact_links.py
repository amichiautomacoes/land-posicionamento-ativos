
"""Build the configured WhatsApp contact URL."""
from urllib.parse import urlencode

CONTACT_MESSAGE = "Olá! Quero atrair mais clientes e destacar minha empresa no Google."


def normalize_phone_number(value):
    return "".join(filter(str.isdigit, value or ""))


def build_whatsapp_url(value):
    number = normalize_phone_number(value)
    if not number:
        return None
    message = urlencode({"text": CONTACT_MESSAGE})
    return f"https://wa.me/{number}?{message}"
