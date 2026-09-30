from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status


class UserAuthTests(APITestCase):

    def test_user_registration(self):
        response = self.client.post(
            "/api/users/register/",
            {
                "username": "testuser",
                "email": "test@example.com",
                "password": "Test@12345",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(
            User.objects.filter(username="testuser").exists()
        )

    def test_protected_endpoint_without_token(self):
        response = self.client.get("/api/users/protected/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )