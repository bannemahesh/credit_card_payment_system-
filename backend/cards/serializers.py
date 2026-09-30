from rest_framework import serializers
from .models import Card


class CardSerializer(serializers.ModelSerializer):
    card_number = serializers.CharField(
        write_only=True,
        min_length=13,
        max_length=19
    )
    cvv = serializers.CharField(
        write_only=True,
        min_length=3,
        max_length=4
    )

    class Meta:
        model = Card
        fields = [
            "id",
            "card_type",
            "card_number",
            "cvv",
            "expiry_month",
            "expiry_year",
            "masked_card",
            "last_four_digits",
            "available_balance",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "masked_card",
            "last_four_digits",
            "available_balance",
            "created_at",
        ]

    def create(self, validated_data):
        card_number = validated_data.pop("card_number")
        validated_data.pop("cvv")

        last_four = card_number[-4:]
        masked_card = f"**** **** **** {last_four}"

        return Card.objects.create(
            user=self.context["request"].user,
            masked_card=masked_card,
            last_four_digits=last_four,
            **validated_data
        )

class AddBalanceSerializer(serializers.Serializer):
    amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=0.01
    )