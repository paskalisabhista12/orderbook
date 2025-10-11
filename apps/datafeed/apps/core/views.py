from rest_framework.decorators import api_view
from rest_framework import status
from apps.core.serializers import CompanySerializer, PriceHistorySerializer
from .models import Company, PriceHistory
from .utils.response_builder import ResponseBuilder


@api_view(["GET"])
def get_stock(request, ticker):
    try:
        company = Company.objects.get(ticker=ticker)
        price_history = PriceHistory.objects.filter(company=company).order_by('-date')
        company_serializer = CompanySerializer(company)
        price_history_serializer = PriceHistorySerializer(price_history, many=True)
        return ResponseBuilder.create_success_response(
            data={
                "company": company_serializer.data,
                "price_history": price_history_serializer.data,
            }
        )

    except Company.DoesNotExist:
        return ResponseBuilder.create_error_response(
            message="Company not found!", status=status.HTTP_404_NOT_FOUND
        )
