from rest_framework import serializers
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


def get_price_history_serializer(model_class):
    """Return a ModelSerializer class for the given model."""

    class DynamicPriceHistorySerializer(serializers.ModelSerializer):
        class Meta:
            model = model_class
            exclude = ["id", "company", "adj_close"]

    return DynamicPriceHistorySerializer
