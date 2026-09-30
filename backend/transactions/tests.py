from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from cards.models import Card
from transactions.models import Transaction


class PaymentTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="paymenttest",
            password="Test@12345"
        )

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )

        self.card = Card.objects.create(
            user=self.user,
            card_type="CREDIT",
            masked_card="**** **** **** 1111",
            last_four_digits="1111",
            expiry_month=12,
            expiry_year=2029,
            available_balance=1000,
        )

    def test_payment_transaction_model(self):
        transaction = Transaction.objects.create(
            user=self.user,
            card=self.card,
            transaction_id="TEST-TXN-001",
            amount=100,
            status="SUCCESS",
        )

        self.assertEqual(transaction.status, "SUCCESS")
        self.assertEqual(transaction.amount, 100)