from rest_framework import generics
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User
from cards.models import Card
from transactions.models import Transaction
from django.db.models import Sum
from django.contrib.auth.models import User

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

# Create your views here.



class ProtectedTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "You are authenticated",
            "username": request.user.username
        })

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            "total_users": User.objects.count(),
            "total_cards": Card.objects.count(),
            "total_transactions": Transaction.objects.count(),
            "successful_payments": Transaction.objects.filter(
                status="SUCCESS"
            ).count(),
            "failed_payments": Transaction.objects.filter(
                status="FAILED"
            ).count(),
            "pending_payments": Transaction.objects.filter(
                status="PENDING"
            ).count(),
            "total_amount": Transaction.objects.aggregate(
                total=Sum("amount")
            )["total"] or 0,
        })

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser,
        })