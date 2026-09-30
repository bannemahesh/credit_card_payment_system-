# Credit Card Payment System

A full-stack simulated credit card payment system built with Django, FastAPI, React, Tailwind CSS, and MySQL.

## Features

- User registration and JWT authentication
- Protected user routes
- Admin authentication and admin dashboard
- Add and manage credit/debit cards
- Card masking and last-four-digit storage
- CVV is never stored
- Simulated credit card payments
- PENDING → SUCCESS / FAILED payment flow
- Balance validation and deduction
- Transaction history
- Transaction filtering by status and amount
- Django Admin
- Admin payment statistics
- CSV transaction export
- Swagger/OpenAPI documentation
- Postman API collection
- MySQL database
- Docker and Docker Compose
- Automated tests
- 86% test coverage
- Responsive React + Tailwind UI

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Django
- Django REST Framework
- Simple JWT
- drf-spectacular

### Payment Service
- FastAPI
- SQLAlchemy
- PyMySQL
- JWT authentication

### Database
- MySQL 8

### Testing
- Django REST Framework tests
- Coverage.py
- 86% test coverage

### Deployment
- Docker
- Docker Compose
- Nginx

## Project Structure

```text
credit_card_payment_system/
├── backend/
│   ├── config/
│   ├── users/
│   ├── cards/
│   ├── transactions/
│   ├── fastapi_app/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
├── database/
│   └── credit_card_system.sql
├── postman/
│   ├── Credit_Card_Payment_System.postman_collection.json
│   └── resources.yaml
├── screenshots/
├── docker/
│   ├── django/
│   │   └── Dockerfile
│   ├── fastapi/
│   │   └── Dockerfile
│   └── frontend/
│       └── Dockerfile
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md