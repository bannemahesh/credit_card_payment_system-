import os
import sys

# Add the backend folder to Python's path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()

from django.conf import settings
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker


db = settings.DATABASES["default"]

DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=db["USER"],
    password=db["PASSWORD"],
    host=db["HOST"],
    port=int(db["PORT"]),
    database=db["NAME"],
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)