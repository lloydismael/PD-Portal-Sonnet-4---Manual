from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Customer schemas
class CustomerBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    
    class Config:
        from_attributes = True

# Cost Center schemas
class CostCenterBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    customer_id: int

class CostCenterCreate(CostCenterBase):
    pass

class CostCenter(CostCenterBase):
    id: int
    customer: Customer
    
    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    role: str = "employee"

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True

# Form schemas
class FormBase(BaseModel):
    form_type: str
    total_amount: float
    remarks: Optional[str] = None
    cost_center_id: int
    assigned_to_id: Optional[int] = None

class FormCreate(FormBase):
    pass

class Form(FormBase):
    id: int
    form_number: str
    date_created: datetime
    status: str
    attachment_path: Optional[str] = None
    submitted_by_id: int
    submitted_by: User
    assigned_to: Optional[User] = None
    cost_center: CostCenter
    
    class Config:
        from_attributes = True

# Response schemas
class FormListResponse(BaseModel):
    forms: List[Form]
    total: int

class CustomerListResponse(BaseModel):
    customers: List[Customer]

class CostCenterListResponse(BaseModel):
    cost_centers: List[CostCenter]

class UserListResponse(BaseModel):
    users: List[User]