from celery import shared_task
from celery.utils.log import get_task_logger
from .models import Company
import yfinance as yf

logger = get_task_logger(__name__)


@shared_task(queue="scraper.batching_fetch_stock_data")
def batch_fetch_stock_data(tickers):
    for ticker in tickers:
        fetch_stock_data(ticker)

    return f"Processed {tickers}"


def fetch_stock_data(ticker: str) -> None:
    try:
        ticker_yf = yf.Ticker(f"{ticker}.JK")
        info = ticker_yf.info

        _, created = Company.objects.update_or_create(
            ticker=ticker,
            defaults={
                "name": info.get("longName"),
                "sector": info.get("sector"),
                "industry": info.get("industry"),
                "website": info.get("website"),
                "employees": info.get("fullTimeEmployees"),
                "description": info.get("longBusinessSummary"),
                "country": info.get("country"),
                "city": info.get("city"),
            },
        )

        if created:
            logger.info(f"✅ New company created: {ticker}")
        else:
            logger.info(f"🔄 Existing company updated: {ticker}")

    except Exception as e:
        logger.error(f"❌ Error fetching data for {ticker}: {e}")
