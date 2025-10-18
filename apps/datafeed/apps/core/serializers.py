from rest_framework import serializers
from .models import Company, PriceHistoryD1


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class PriceHistoryD1Serializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistoryD1
        exclude = ["company", "id", "adj_close"]
