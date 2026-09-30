import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import text
from uuid import uuid4
from jose import jwt

from database import engine, SessionLocal
from payment_model import Transaction


app = FastAPI(
    title="Credit Card Payment API",
    description="Simulated credit card payment service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            os.getenv("SECRET_KEY"),
            algorithms=["HS256"],
        )

        user_id = int(payload.get("user_id"))

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return user_id

    except Exception as e:
        print("JWT ERROR:", repr(e))
        raise HTTPException(
            status_code=401,
            detail=f"JWT validation failed: {str(e)}"
        )
class PaymentRequest(BaseModel):
    user_id: int
    card_id: int
    amount: float = Field(gt=0)


@app.get("/")
def root():
    return {
        "message": "Credit Card Payment API is running"
    }


@app.get("/db-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "result": result.scalar()
        }


@app.post("/payments/")
def make_payment(
    payment: PaymentRequest,
    current_user_id: int = Depends(get_current_user),
):
    db: Session = SessionLocal()

    try:
        # Verify that the user exists
        if payment.user_id != current_user_id:
            raise HTTPException(
                status_code=403,
                detail="You can only make payments for your own account"
            )

        user_exists = db.execute(
            text("SELECT id FROM auth_user WHERE id = :user_id"),
            {"user_id": current_user_id}
        ).first()

        if not user_exists:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Verify that the card belongs to the user
        card_exists = db.execute(
            text("""
                SELECT id, available_balance
                FROM cards_card
                WHERE id = :card_id AND user_id = :user_id
            """),
            {
                "card_id": payment.card_id,
                "user_id": payment.user_id
            }
        ).first()

        if not card_exists:
            raise HTTPException(
                status_code=404,
                detail="Card not found for this user"
            )

        available_balance = card_exists.available_balance

        if available_balance < payment.amount:
            transaction = Transaction(
                user_id=payment.user_id,
                card_id=payment.card_id,
                transaction_id=f"TXN-{uuid4().hex[:12].upper()}",
                amount=payment.amount,
                status="PENDING"
            )

            db.add(transaction)
            db.commit()
            db.refresh(transaction)

            transaction.status = "FAILED"

            db.commit()
            db.refresh(transaction)

            return {
                "transaction_id": transaction.transaction_id,
                "amount": float(transaction.amount),
                "status": transaction.status,
                "message": "Payment failed: Insufficient balance"
            }
        # Create transaction with PENDING status
        transaction = Transaction(
            user_id=payment.user_id,
            card_id=payment.card_id,
            transaction_id=f"TXN-{uuid4().hex[:12].upper()}",
            amount=payment.amount,
            status="PENDING"
        )

        db.add(transaction)
        db.commit()
        db.refresh(transaction)

        # Simulate final payment result
        transaction.status = "SUCCESS"

        db.execute(
            text("""
                UPDATE cards_card
                SET available_balance = available_balance - :amount
                WHERE id = :card_id AND user_id = :user_id
            """),
            {
                "amount": payment.amount,
                "card_id": payment.card_id,
                "user_id": payment.user_id,
            }
        )

        db.commit()
        db.refresh(transaction)
        
        return {
            "transaction_id": transaction.transaction_id,
            "amount": float(transaction.amount),
            "status": transaction.status,
            "message": (
                "Payment successful"
                if transaction.status == "SUCCESS"
                else "Payment failed"
            )
        }

    finally:
        db.close()