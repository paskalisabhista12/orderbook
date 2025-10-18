from rest_framework.decorators import api_view
from rest_framework import status
from apps.core.serializers import CompanySerializer, PriceHistoryD1Serializer
from .models import Company, PriceHistoryD1
from .utils.response_builder import ResponseBuilder
from .type import TIMEFRAME


@api_view(["GET"])
def get_stock(request, ticker):
    try:
        company = Company.objects.get(ticker=ticker)
        price_history = PriceHistoryD1.objects.filter(company=company).order_by("-date")
        company_serializer = CompanySerializer(company)
        price_history_serializer = PriceHistoryD1Serializer(price_history, many=True)
        return ResponseBuilder.create_success_response(
            data={
                "company": company_serializer.data,
                "price_history": {
                    "timeframe": TIMEFRAME.D1,
                    "price": price_history_serializer.data,
                },
            }
        )

    except Company.DoesNotExist:
        return ResponseBuilder.create_error_response(
            message="Company not found!", status=status.HTTP_404_NOT_FOUND
        )
