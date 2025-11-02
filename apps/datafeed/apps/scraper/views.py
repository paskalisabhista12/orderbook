from datetime import datetime, timezone
from django.db import IntegrityError
from rest_framework.decorators import api_view
from playwright.async_api import async_playwright
from apps.core.models import (
    Company,
    PriceHistoryD1,
    PriceHistoryH1,
    PriceHistoryM15,
    PriceHistoryM30,
    PriceHistoryM5,
)
from apps.core.utils.response_builder import ResponseBuilder
from apps.scraper.tasks import fetch_daily_stock_data
from playwright.async_api import async_playwright
from rest_framework import serializers
from rest_framework import status
import yfinance as yf
import asyncio
import threading


async def fetch_tickers():
    url = "https://www.idx.co.id/id/perusahaan-tercatat/profil-perusahaan-tercatat"

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Set user-agent
        await page.set_extra_http_headers(
            {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/114.0 Safari/537.36"
                )
            }
        )

        try:
            await page.goto(url, wait_until="networkidle")

            next_button = (
                await page.query_selector_all("button.footer__navigation__page-btn")
            )[2]

            while True:
                is_enabled = True  # Next button is clickable flag
                class_name = await next_button.get_attribute("class")

                # If the button disabled (occurs when table reach the last page)
                if class_name and "disabled" in class_name.split():
                    is_enabled = False

                texts = []
                # Select table rows
                rows = await page.query_selector_all("table#vgt-table tbody tr")
                for row in rows:
                    first_td = await row.query_selector("td")
                    if first_td:
                        text = await first_td.inner_text()
                        texts.append(text.strip())

                print(f"Sending {texts} to scraper.fetch_daily_stock_data")
                fetch_daily_stock_data.apply_async(
                    args=[texts], queue="scraper.fetch_daily_stock_data"
                )

                # If the last page then break, else go to next page
                if not is_enabled:
                    break
                else:
                    await next_button.click()

            return texts

        except Exception as e:
            print(f"Error fetching tickers: {e}")
            return []

        finally:
            await browser.close()


@api_view(["POST"])
def fetch_ticker(request):
    threading.Thread(target=lambda: asyncio.run(fetch_tickers())).start()
    return ResponseBuilder.create_success_response(message="Job sent!")


# Request serializer
class FetchPriceSerializer(serializers.Serializer):
    ticker = serializers.CharField(required=True, max_length=20)
    period = serializers.CharField(default="1mo")
    interval = serializers.CharField(default="1d")


@api_view(["POST"])
def fetch_price(request):
    serializer = FetchPriceSerializer(data=request.data)

    if not serializer.is_valid():
        return ResponseBuilder.create_error_response(
            message=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
    ticker_symbol = serializer.validated_data["ticker"]
    period = serializer.validated_data["period"]
    interval = serializer.validated_data["interval"]

    try:
        company = Company.objects.get(ticker=ticker_symbol)
    except Company.DoesNotExist:
        return ResponseBuilder.create_error_response(
            message=f"Company with ticker {ticker_symbol} not found!",
            status=status.HTTP_404_NOT_FOUND,
        )

    ticker = yf.Ticker(f"{ticker_symbol}.JK")
    hist = ticker.history(period=period, interval=interval)

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

    return ResponseBuilder.create_success_response(
        message=f"Fetched {created_rows} new records for {company.name}.",
        status=status.HTTP_201_CREATED,
    )
