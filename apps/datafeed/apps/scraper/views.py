from rest_framework.decorators import api_view
from playwright.async_api import async_playwright
from apps.scraper.tasks import batch_fetch_stock_data
from playwright.async_api import async_playwright
from rest_framework.response import Response
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

                print(f"Sending {texts} to scraper.batching_fetch_stock_data")
                batch_fetch_stock_data.apply_async(args=[texts], queue="scraper.batching_fetch_stock_data")

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


@api_view(["GET"])
def get_tickers(request):
    threading.Thread(target=lambda: asyncio.run(fetch_tickers())).start()
    return Response({"tickers": "Success send a job"})


@api_view(["POST"])
def scrap_company(request):
    
    ticker = yf.Ticker("PYFA.JK")
    info = ticker.info

    print("Name:", info.get("longName"))
    print("Sector:", info.get("sector"))
    print("Industry:", info.get("industry"))
    print("Website:", info.get("website"))
    print("Employees:", info.get("fullTimeEmployees"))
    print("Summary:", info.get("longBusinessSummary")[:200], "...")

    return Response({"message": "Hello from DRF API"})
