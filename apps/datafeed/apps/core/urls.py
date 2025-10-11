from . import views

from django.urls import path

urlpatterns = [
    path("<str:ticker>", views.get_stock),
]
