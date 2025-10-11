from datetime import datetime, timezone
from celery import shared_task
from celery.utils.log import get_task_logger
from django.db import IntegrityError
from apps.core.models import Company, PriceHistory
import yfinance as yf

logger = get_task_logger(__name__)


@shared_task(queue="scraper.batching_fetch_stock_data")
def batch_fetch_stock_data(tickers):
    for ticker in tickers:
        fetch_stock_data(ticker)
        fetch_price_history(ticker=ticker)

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


def fetch_price_history(ticker, period="1mo", interval="1d") -> None:
    try:
        company = Company.objects.get(ticker=ticker)  # May throw not found exception
        ticker_symbol = yf.Ticker(f"{ticker}.JK")
        hist = ticker_symbol.history(period=period, interval=interval)

        created_rows = 0
        for index, row in hist.iterrows():
            date = datetime.fromtimestamp(index.timestamp(), tz=timezone.utc)

            try:
                PriceHistory.objects.create(
                    company=company,
                    date=date,
                    open=row["Open"],
                    high=row["High"],
                    low=row["Low"],
                    close=row["Close"],
                    adj_close=row.get("Adj Close", None),
                    volume=row["Volume"],
                )
                created_rows += 1
            except IntegrityError:
                # Skip if (company, date) already exists
                continue
        logger.info(f"Fetched {created_rows} new records for {ticker}")
    except Exception as e:
        logger.error(f"❌ Error fetching price history for {ticker}: {e}")
