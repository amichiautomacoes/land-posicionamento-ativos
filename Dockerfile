# syntax=docker/dockerfile:1
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=8504

WORKDIR /opt/landing

COPY requirements/base.txt requirements/production.txt ./requirements/
RUN python -m pip install --no-cache-dir -r requirements/production.txt \
    && groupadd --system landing \
    && useradd --system --gid landing --home-dir /opt/landing --no-create-home landing

COPY --chown=landing:landing app/ ./app/

USER landing

EXPOSE 8504

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["python", "-c", "from urllib.request import urlopen; urlopen('http://127.0.0.1:8504/', timeout=3).close()"]

CMD ["waitress-serve", "--host=0.0.0.0", "--port=8504", "--threads=4", "--call", "app:create_app"]
