import time
import yfinance as yf 
from datetime import datetime, timezone
from celery import shared_task
from celery.utils.log import get_task_logger
from django.db import IntegrityError
from apps.core.models import (
    Company,
    PriceHistoryD1,
    PriceHistoryH1,
    PriceHistoryM15,
    PriceHistoryM30,
    PriceHistoryM5,
)

logger = get_task_logger(__name__)


@shared_task(queue="scraper.schedule_to_fetch_daily_stock_data")
def schedule_to_fetch_daily_stock_data():
    start_time = time.perf_counter()
    logger.info(
        f"[SCHEDULER] Running schedule_to_fetch_daily_stock_data task at {datetime.now()}"
    )

    companies = Company.objects.all()
    tickers = [company.ticker for company in companies]

    fetch_daily_stock_data(tickers)

    end_time = time.perf_counter()
    duration = end_time - start_time
    logger.info(
        f"[SCHEDULER] Completed schedule_to_fetch_daily_stock_data in {duration:.2f} seconds."
    )


@shared_task(queue="scraper.schedule_to_fetch_h1_stock_data")
def schedule_to_fetch_h1_stock_data():
    start_time = time.perf_counter()
    logger.info(
        f"[SCHEDULER] Running schedule_to_fetch_h1_stock_data task at {datetime.now()}"
    )

    companies = Company.objects.all()
    tickers = [company.ticker for company in companies]

    fetch_h1_stock_data(tickers)

    end_time = time.perf_counter()
    duration = end_time - start_time
    logger.info(
        f"[SCHEDULER] Completed schedule_to_fetch_h1_stock_data in {duration:.2f} seconds."
    )


@shared_task(queue="scraper.schedule_to_fetch_m30_stock_data")
def schedule_to_fetch_m30_stock_data():
    start_time = time.perf_counter()
    logger.info(
        f"[SCHEDULER] Running schedule_to_fetch_m30_stock_data task at {datetime.now()}"
    )

    companies = Company.objects.all()
    tickers = [company.ticker for company in companies]

    fetch_m30_stock_data(tickers)

    end_time = time.perf_counter()
    duration = end_time - start_time
    logger.info(
        f"[SCHEDULER] Completed schedule_to_fetch_m30_stock_data in {duration:.2f} seconds."
    )


@shared_task(queue="scraper.schedule_to_fetch_m15_stock_data")
def schedule_to_fetch_m15_stock_data():
    start_time = time.perf_counter()
    logger.info(
        f"[SCHEDULER] Running schedule_to_fetch_m15_stock_data task at {datetime.now()}"
    )

    companies = Company.objects.all()
    tickers = [company.ticker for company in companies]

    fetch_m15_stock_data(tickers)

    end_time = time.perf_counter()
    duration = end_time - start_time
    logger.info(
        f"[SCHEDULER] Completed schedule_to_fetch_m15_stock_data in {duration:.2f} seconds."
    )


@shared_task(queue="scraper.schedule_to_fetch_m5_stock_data")
def schedule_to_fetch_m5_stock_data():
    start_time = time.perf_counter()
    logger.info(
        f"[SCHEDULER] Running schedule_to_fetch_m5_stock_data task at {datetime.now()}"
    )

    companies = Company.objects.all()
    tickers = [company.ticker for company in companies]

    fetch_m5_stock_data(tickers)

    end_time = time.perf_counter()
    duration = end_time - start_time
    logger.info(
        f"[SCHEDULER] Completed schedule_to_fetch_m5_stock_data in {duration:.2f} seconds."
    )


@shared_task(queue="scraper.fetch_daily_stock_data")
def fetch_daily_stock_data(tickers):
    for ticker in tickers:
        fetch_stock_data(ticker)
        fetch_price_history(ticker=ticker)

    return f"Processed {tickers} @D1"


def fetch_h1_stock_data(tickers):
    for ticker in tickers:
        fetch_price_history(period="14d", interval="1h", ticker=ticker)

    return f"Processed {tickers} @H1"


def fetch_m30_stock_data(tickers):
    for ticker in tickers:
        fetch_price_history(period="7d", interval="30m", ticker=ticker)

    return f"Processed {tickers} @M30"


def fetch_m15_stock_data(tickers):
    for ticker in tickers:
        fetch_price_history(period="3d", interval="15m", ticker=ticker)

    return f"Processed {tickers} @M15"


def fetch_m5_stock_data(tickers):
    for ticker in tickers:
        fetch_price_history(period="2d", interval="5m", ticker=ticker)

    return f"Processed {tickers} @M5"


# Below are scheduler core functions


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
                match interval:
                    case "1d":
                        PriceHistoryD1.objects.create(
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
                    case "1h":
                        PriceHistoryH1.objects.create(
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
                    case "30m":
                        PriceHistoryM30.objects.create(
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
                    case "15m":
                        PriceHistoryM15.objects.create(
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
                    case "5m":
                        PriceHistoryM5.objects.create(
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
        logger.info(f"Fetched {created_rows} new records for {ticker} @{interval}")
    except Exception as e:
        logger.error(f"❌ Error fetching price history for {ticker}: {e}")
