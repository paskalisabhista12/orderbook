# Builder
FROM python:3.11-slim AS builder
WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Install playwright + browsers
RUN playwright install chromium

# =========================
# Final image
# =========================
FROM python:3.11-slim
WORKDIR /app

# 🔴 Install OS deps HERE (runtime)
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libgtk-3-0 \
    fonts-liberation \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Python deps
COPY --from=builder /usr/local /usr/local

# Playwright browsers
COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright

COPY . .

EXPOSE 8000
CMD ["gunicorn", "datafeed.wsgi:application", "--bind", "0.0.0.0:8000"]
