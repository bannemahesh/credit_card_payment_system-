from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import AddBalanceSerializer

from .models import Card
from .serializers import CardSerializer


class CardListCreateView(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)


class CardDeleteView(generics.DestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(user=self.request.user)

class AddBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            card = Card.objects.get(
                id=pk,
                user=request.user
            )
        except Card.DoesNotExist:
            return Response(
                {"detail": "Card not found."},
                status=404
            )

        serializer = AddBalanceSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=400
            )

        amount = serializer.validated_data["amount"]

        card.available_balance += amount
        card.save(update_fields=["available_balance"])

        return Response({
            "message": "Balance added successfully.",
            "card_id": card.id,
            "available_balance": card.available_balance,
        })