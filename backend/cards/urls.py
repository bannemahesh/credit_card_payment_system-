from django.urls import path
from .views import (
    CardListCreateView,
    CardDeleteView,
    AddBalanceView,
)

urlpatterns = [
    path("", CardListCreateView.as_view(), name="card-list-create"),
    path("<int:pk>/", CardDeleteView.as_view(), name="card-delete"),
    path("<int:pk>/add-balance/", AddBalanceView.as_view(), name="add-balance"),
]