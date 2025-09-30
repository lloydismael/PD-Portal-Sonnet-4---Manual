from sqlalchemy.orm import Session
from app.database import SessionLocal, Customer, CostCenter, User

def create_sample_data():
    """Create sample customers, cost centers, and users"""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Customer).first():
            print("Sample data already exists")
            return
        
        # Create sample customers
        customers = [
            Customer(name="Acme Corporation", code="ACM001", description="Main corporate client"),
            Customer(name="Tech Solutions Inc", code="TSI002", description="Technology consulting client"),
            Customer(name="Global Industries", code="GLB003", description="Manufacturing client"),
            Customer(name="StartUp Ventures", code="SUV004", description="Emerging business client")
        ]
        
        for customer in customers:
            db.add(customer)
        db.commit()
        
        # Create sample cost centers
        cost_centers = [
            CostCenter(name="Project Alpha", code="PA-2024-001", description="Digital transformation project", customer_id=1),
            CostCenter(name="Project Beta", code="PB-2024-002", description="Infrastructure upgrade", customer_id=1),
            CostCenter(name="Cloud Migration", code="CM-2024-003", description="Cloud infrastructure setup", customer_id=2),
            CostCenter(name="Security Audit", code="SA-2024-004", description="Cybersecurity assessment", customer_id=2),
            CostCenter(name="Manufacturing Optimization", code="MO-2024-005", description="Process improvement project", customer_id=3),
            CostCenter(name="Startup Consultation", code="SC-2024-006", description="Business development support", customer_id=4)
        ]
        
        for cost_center in cost_centers:
            db.add(cost_center)
        db.commit()
        
        # Create sample users
        users = [
            User(username="john.doe", email="john.doe@company.com", full_name="John Doe", role="employee"),
            User(username="jane.smith", email="jane.smith@company.com", full_name="Jane Smith", role="employee"),
            User(username="mike.johnson", email="mike.johnson@company.com", full_name="Mike Johnson", role="project_manager"),
            User(username="sarah.wilson", email="sarah.wilson@company.com", full_name="Sarah Wilson", role="project_manager"),
            User(username="admin", email="admin@company.com", full_name="System Administrator", role="admin")
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        print("Sample data created successfully!")
        print(f"Created {len(customers)} customers")
        print(f"Created {len(cost_centers)} cost centers")
        print(f"Created {len(users)} users")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()