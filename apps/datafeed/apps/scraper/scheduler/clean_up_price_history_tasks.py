from datetime import datetime
from celery import shared_task
from celery.utils.log import get_task_logger
from apps.core.models import *
import time

logger = get_task_logger(__name__)


@shared_task(queue="scraper.schedule_to_clean_up_price_history")
def schedule_to_clean_up_price_history():
    start_time = time.perf_counter()
    logger.info(
        f"[SCHEDULER] Running schedule_to_clean_up_price_history task at {datetime.now()}"
    )

    companies = Company.objects.all()

    for company in companies:
        cleanup_all_timeframes(company)

    end_time = time.perf_counter()
    duration = end_time - start_time
    logger.info(
        f"[SCHEDULER] Completed schedule_to_clean_up_price_history in {duration:.2f} seconds."
    )


def cleanup_all_timeframes(company: Company):
    deleted = {}

    deleted["D1"] = cleanup_timeframe(PriceHistoryD1, keep_rows=1000, company=company)
    deleted["H1"] = cleanup_timeframe(PriceHistoryH1, keep_rows=3000, company=company)
    deleted["M30"] = cleanup_timeframe(PriceHistoryM30, keep_rows=5000, company=company)
    deleted["M15"] = cleanup_timeframe(PriceHistoryM15, keep_rows=9000, company=company)
    deleted["M5"] = cleanup_timeframe(PriceHistoryM5, keep_rows=26000, company=company)

    # Sum all deleted counts
    total_deleted = sum(deleted.values())

    logger.info(
        f"[SCHEDULER] Completed to clean up {total_deleted} record(s) of {company.ticker} priceHistory."
    )
    return deleted


def cleanup_timeframe(model, keep_rows: int, company: Company):
    qs = model.objects.filter(
        company=company,
    ).order_by("-id")
    total = qs.count()

    if total <= keep_rows:
        return 0  # nothing to delete

    # Find the cutoff primary key for THIS company only
    cutoff_id = qs[keep_rows - 1].id

    # Delete only this company's older rows
    deleted_count, _ = (
        model.objects.filter(company=company, id__lt=cutoff_id).delete()
    )

    return deleted_count

