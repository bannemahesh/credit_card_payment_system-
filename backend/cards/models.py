from django.db import models
from django.contrib.auth.models import User


class Card(models.Model):
    CARD_TYPE_CHOICES = [
        ("CREDIT", "Credit"),
        ("DEBIT", "Debit"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cards"
    )
    card_type = models.CharField(
        max_length=10,
        choices=CARD_TYPE_CHOICES
    )
    masked_card = models.CharField(max_length=19)
    last_four_digits = models.CharField(max_length=4)
    expiry_month = models.PositiveSmallIntegerField()
    expiry_year = models.PositiveSmallIntegerField()
    available_balance = models.DecimalField(
    max_digits=12,
    decimal_places=2,
    default=0
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.card_type} ****{self.last_four_digits}"
