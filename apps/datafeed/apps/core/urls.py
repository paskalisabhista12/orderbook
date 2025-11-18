from . import views

from django.urls import path

urlpatterns = [
    path("price-history/<str:ticker>", views.get_stock_price_history),
    path("company/<str:ticker>", views.get_stock),
    path('get-ticker', views.get_ticker)
]
