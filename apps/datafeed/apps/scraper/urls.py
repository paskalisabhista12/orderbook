from . import views

from django.urls import path

urlpatterns = [
    path("get-tickers", views.get_tickers),
    path("fetch-price", views.fetch_price),
]
