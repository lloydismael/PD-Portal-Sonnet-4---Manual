from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form as FastAPIForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
from datetime import datetime

from . import database, schemas
from .database import get_db

app = FastAPI(title="Reimbursement Management System", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Utility function to generate form numbers
def generate_form_number(form_type: str, db: Session) -> str:
    """Generate unique form number based on type and current count"""
    prefix_map = {
        "reimbursement": "REI",
        "cash_advance": "CA", 
        "liquidation": "LIQ"
    }
    prefix = prefix_map.get(form_type, "FORM")
    
    # Get count of existing forms of this type
    count = db.query(database.Form).filter(database.Form.form_type == form_type).count()
    return f"{prefix}-{datetime.now().year}-{count + 1:04d}"

# Customer endpoints
@app.get("/customers", response_model=schemas.CustomerListResponse)
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(database.Customer).all()
    return {"customers": customers}

@app.post("/customers", response_model=schemas.Customer)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    db_customer = database.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# Cost Center endpoints
@app.get("/cost-centers", response_model=schemas.CostCenterListResponse)
def get_cost_centers(customer_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(database.CostCenter)
    if customer_id:
        query = query.filter(database.CostCenter.customer_id == customer_id)
    cost_centers = query.all()
    return {"cost_centers": cost_centers}

@app.post("/cost-centers", response_model=schemas.CostCenter)
def create_cost_center(cost_center: schemas.CostCenterCreate, db: Session = Depends(get_db)):
    db_cost_center = database.CostCenter(**cost_center.dict())
    db.add(db_cost_center)
    db.commit()
    db.refresh(db_cost_center)
    return db_cost_center

# User endpoints
@app.get("/users", response_model=schemas.UserListResponse)
def get_users(role: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(database.User)
    if role:
        query = query.filter(database.User.role == role)
    users = query.all()
    return {"users": users}

@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = database.User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Form endpoints
@app.get("/forms", response_model=schemas.FormListResponse)
def get_forms(
    form_type: Optional[str] = None,
    status: Optional[str] = None, 
    submitted_by_id: Optional[int] = None,
    assigned_to_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(database.Form)
    
    if form_type:
        query = query.filter(database.Form.form_type == form_type)
    if status:
        query = query.filter(database.Form.status == status)
    if submitted_by_id:
        query = query.filter(database.Form.submitted_by_id == submitted_by_id)
    if assigned_to_id:
        query = query.filter(database.Form.assigned_to_id == assigned_to_id)
    
    forms = query.all()
    return {"forms": forms, "total": len(forms)}

@app.post("/forms", response_model=schemas.Form)
def create_form(
    form_type: str = FastAPIForm(...),
    total_amount: float = FastAPIForm(...),
    cost_center_id: int = FastAPIForm(...),
    submitted_by_id: int = FastAPIForm(...),
    assigned_to_id: Optional[int] = FastAPIForm(None),
    remarks: Optional[str] = FastAPIForm(None),
    attachment: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Generate form number
    form_number = generate_form_number(form_type, db)
    
    # Handle file upload
    attachment_path = None
    if attachment:
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_extension = os.path.splitext(attachment.filename)[1]
        filename = f"{form_number}{file_extension}"
        file_path = os.path.join(upload_dir, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(attachment.file, buffer)
        
        attachment_path = f"/uploads/{filename}"
    
    # Create form
    db_form = database.Form(
        form_number=form_number,
        form_type=form_type,
        total_amount=total_amount,
        cost_center_id=cost_center_id,
        submitted_by_id=submitted_by_id,
        assigned_to_id=assigned_to_id,
        remarks=remarks,
        attachment_path=attachment_path
    )
    
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    return db_form

@app.get("/forms/{form_id}", response_model=schemas.Form)
def get_form(form_id: int, db: Session = Depends(get_db)):
    form = db.query(database.Form).filter(database.Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form

@app.put("/forms/{form_id}/status")
def update_form_status(
    form_id: int, 
    status: str = FastAPIForm(...),
    db: Session = Depends(get_db)
):
    form = db.query(database.Form).filter(database.Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    form.status = status
    db.commit()
    db.refresh(form)
    return {"message": "Status updated successfully", "form": form}

@app.put("/forms/{form_id}/assign")
def assign_form(
    form_id: int,
    assigned_to_id: int = FastAPIForm(...),
    db: Session = Depends(get_db)
):
    form = db.query(database.Form).filter(database.Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    form.assigned_to_id = assigned_to_id
    db.commit()
    db.refresh(form)
    return {"message": "Form assigned successfully", "form": form}

# Dashboard endpoint
@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_forms = db.query(database.Form).count()
    pending_forms = db.query(database.Form).filter(database.Form.status == "pending").count()
    approved_forms = db.query(database.Form).filter(database.Form.status == "approved").count()
    rejected_forms = db.query(database.Form).filter(database.Form.status == "rejected").count()
    
    return {
        "total_forms": total_forms,
        "pending_forms": pending_forms,
        "approved_forms": approved_forms,
        "rejected_forms": rejected_forms
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)