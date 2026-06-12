from sqlalchemy import create_engine, Column, String, DateTime, JSON
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import get_settings
from datetime import datetime
import uuid

settings = get_settings()

engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Twin(Base):
    __tablename__ = "twins"

    twin_id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    state = Column(String, index=True)
    item_data = Column(JSON, nullable=False)
    customer_data = Column(JSON, nullable=False)
    prevention_data = Column(JSON, nullable=True)
    grading_data = Column(JSON, nullable=True)
    valuation_data = Column(JSON, nullable=True)
    routing_data = Column(JSON, nullable=True)
    credits_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
