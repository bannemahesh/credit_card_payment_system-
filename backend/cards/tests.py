from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class CardTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="cardtest",
            password="Test@12345"
        )

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}"
        )

    def test_add_card(self):
        response = self.client.post(
            "/api/cards/",
            {
                "card_type": "CREDIT",
                "card_number": "4111111111111111",
                "cvv": "123",
                "expiry_month": 12,
                "expiry_year": 2029,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["last_four_digits"], "1111")

    def test_view_cards(self):
        response = self.client.get("/api/cards/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)