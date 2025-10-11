from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from apps.core.serializers import CompanySerializer
from .models import Company


@api_view(["GET"])
def get_stock(request, ticker):
    try:
        company = Company.objects.get(ticker=ticker)
        serializer = CompanySerializer(company)
        return Response({"message": serializer.data})
    except Company.DoesNotExist:
        return Response(
            {"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND
        )
