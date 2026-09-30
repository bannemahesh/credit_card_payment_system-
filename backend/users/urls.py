from django.urls import path
from .views import (
    RegisterView,
    ProtectedTestView,
    AdminDashboardView,
    CurrentUserView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("protected/", ProtectedTestView.as_view(), name="protected"),
    path("admin-dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
]