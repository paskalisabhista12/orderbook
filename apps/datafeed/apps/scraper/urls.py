from . import views

from django.urls import path

urlpatterns = [
    path("fetch-ticker", views.fetch_ticker),
    path("fetch-price", views.fetch_price),
]
