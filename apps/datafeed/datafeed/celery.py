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
        "scraper.batching_fetch_stock_data",
        routing_key="scraper.batching_fetch_stock_data",
        durable=True,
    ),
]

# -----------------------------------------------------------------------------
# 5. Auto-discover tasks from all installed apps
# -----------------------------------------------------------------------------
app.autodiscover_tasks()
