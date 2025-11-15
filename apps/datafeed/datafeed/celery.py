import os
from celery import Celery
from kombu import Queue

# -----------------------------------------------------------------------------
# 1. Set default Django settings
# -----------------------------------------------------------------------------
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "datafeed.settings")

# -----------------------------------------------------------------------------
# 2. Initialize Celery app
# -----------------------------------------------------------------------------
app = Celery("datafeed")

# -----------------------------------------------------------------------------
# 3. Load configuration from Django settings with CELERY_ prefix
# -----------------------------------------------------------------------------
app.config_from_object("django.conf:settings", namespace="CELERY")

# -----------------------------------------------------------------------------
# 4. Queue configuration
# -----------------------------------------------------------------------------

# Explicitly declare queues so RabbitMQ won't create auto-delete ones
app.conf.task_queues = [
    Queue(
        "scraper.fetch_daily_stock_data",
        routing_key="scraper.fetch_daily_stock_data",
        durable=True,
    ),
    Queue(
        "scraper.schedule_to_fetch_daily_stock_data",
        routing_key="scraper.schedule_to_fetch_daily_stock_data",
        durable=True,
    ),
    Queue(
        "scraper.schedule_to_fetch_h1_stock_data",
        routing_key="scraper.schedule_to_fetch_h1_stock_data",
        durable=True,
    ),
    Queue(
        "scraper.schedule_to_fetch_m30_stock_data",
        routing_key="scraper.schedule_to_fetch_m30_stock_data",
        durable=True,
    ),
    Queue(
        "scraper.schedule_to_fetch_m15_stock_data",
        routing_key="scraper.schedule_to_fetch_m15_stock_data",
        durable=True,
    ),
    Queue(
        "scraper.schedule_to_fetch_m5_stock_data",
        routing_key="scraper.schedule_to_fetch_5_stock_data",
        durable=True,
    ),
    Queue(
        "scraper.schedule_to_clean_up_price_history",
        routing_key="scraper.schedule_to_clean_up_price_history",
        durable=True,
    ),
]

# -----------------------------------------------------------------------------
# 5. Auto-discover tasks from all installed apps
# -----------------------------------------------------------------------------
app.autodiscover_tasks()
