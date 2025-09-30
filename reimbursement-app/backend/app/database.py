from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Text, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./data/reimbursement.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    description = Column(Text)
    
    # Relationship
    cost_centers = relationship("CostCenter", back_populates="customer")

class CostCenter(Base):
    __tablename__ = "cost_centers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    description = Column(Text)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    
    # Relationships
    customer = relationship("Customer", back_populates="cost_centers")
    forms = relationship("Form", back_populates="cost_center")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    role = Column(String, default="employee")  # employee, project_manager, admin
    is_active = Column(Boolean, default=True)
    
    # Relationships
    submitted_forms = relationship("Form", foreign_keys="Form.submitted_by_id", back_populates="submitted_by")
    assigned_forms = relationship("Form", foreign_keys="Form.assigned_to_id", back_populates="assigned_to")

class Form(Base):
    __tablename__ = "forms"
    
    id = Column(Integer, primary_key=True, index=True)
    form_number = Column(String, unique=True, index=True)
    form_type = Column(String)  # reimbursement, cash_advance, liquidation
    date_created = Column(DateTime, default=datetime.utcnow)
    total_amount = Column(Float)
    remarks = Column(Text)
    status = Column(String, default="pending")  # pending, approved, rejected, completed
    attachment_path = Column(String, nullable=True)
    
    # Foreign Keys
    submitted_by_id = Column(Integer, ForeignKey("users.id"))
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    cost_center_id = Column(Integer, ForeignKey("cost_centers.id"))
    
    # Relationships
    submitted_by = relationship("User", foreign_keys=[submitted_by_id], back_populates="submitted_forms")
    assigned_to = relationship("User", foreign_keys=[assigned_to_id], back_populates="assigned_forms")
    cost_center = relationship("CostCenter", back_populates="forms")

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()