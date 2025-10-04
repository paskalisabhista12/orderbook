from . import views

from django.urls import path

urlpatterns = [
    path("get-tickers", views.get_tickers),
    path("company", views.scrap_company)
]
