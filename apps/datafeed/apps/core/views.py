from rest_framework.decorators import api_view
from rest_framework import status
from apps.core.serializers import (
    CompanySerializer,
    get_price_history_serializer,
)
from .models import (
    Company,
    PriceHistoryD1,
    PriceHistoryH1,
    PriceHistoryM15,
    PriceHistoryM30,
    PriceHistoryM5,
)
from .utils.response_builder import ResponseBuilder
from .type import TIMEFRAME

from rest_framework import serializers


class StockPriceHistoryQueryParamsSerializer(serializers.Serializer):
    # limit = serializers.IntegerField(required=False, min_value=1, max_value=1000, default=100)
    timeframe = serializers.ChoiceField(
        required=False,
        choices=[
            (TIMEFRAME.D1, "Daily"),
            (TIMEFRAME.H1, "Hourly"),
            (TIMEFRAME.M30, "30 Minutes"),
            (TIMEFRAME.M15, "15 Minutes"),
            (TIMEFRAME.M5, "5 Minutes"),
        ],
        default=TIMEFRAME.D1,
    )


@api_view(["GET"])
def get_stock_price_history(request, ticker):
    query_serializer = StockPriceHistoryQueryParamsSerializer(data=request.query_params)
    query_serializer.is_valid(raise_exception=True)
    params = query_serializer.validated_data
    try:
        timeframe = params["timeframe"]
        company = Company.objects.get(ticker=ticker)
        if timeframe == TIMEFRAME.D1:
            model = PriceHistoryD1
        elif timeframe == TIMEFRAME.H1:
            model = PriceHistoryH1
        elif timeframe == TIMEFRAME.M30:
            model = PriceHistoryM30
        elif timeframe == TIMEFRAME.M15:
            model = PriceHistoryM15
        elif timeframe == TIMEFRAME.M5:
            model = PriceHistoryM5

        # Get serializer class for given model
        SerializerClass = get_price_history_serializer(model)
        price_history = model.objects.filter(company=company).order_by("-date")
        serializer = SerializerClass(price_history, many=True)
        return ResponseBuilder.create_success_response(
            data={
                "ticker": ticker,
                "price_history": {
                    "timeframe": timeframe,
                    "price": serializer.data,
                },
            }
        )

    except Company.DoesNotExist:
        return ResponseBuilder.create_error_response(
            message="Company not found!", status=status.HTTP_404_NOT_FOUND
        )


@api_view(["GET"])
def get_stock(request, ticker):
    try:
        company = Company.objects.get(ticker=ticker)
        company_serializer = CompanySerializer(company)
        return ResponseBuilder.create_success_response(
            data={
                "company": company_serializer.data,
            }
        )

    except Company.DoesNotExist:
        return ResponseBuilder.create_error_response(
            message="Company not found!", status=status.HTTP_404_NOT_FOUND
        )
