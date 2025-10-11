from . import views

from django.urls import path

urlpatterns = [
    path("company/<str:ticker>", views.get_stock),
]
