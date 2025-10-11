from rest_framework import serializers
from .models import Company, PriceHistory


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        exclude = ["company", "id", "adj_close"]
