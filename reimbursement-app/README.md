# Company Reimbursement Application

A modern, containerized web application for managing company reimbursements, cash advances, and liquidations.

## Features

- **Reimbursement Forms**: Create and manage reimbursement requests
- **Cash Advance Forms**: Request cash advances with approval workflow
- **Liquidation Forms**: Process liquidation requests
- **Modern UI**: Azure blue theme with glass effects and smooth animations
- **Workflow Management**: Submit forms to Project Managers for review
- **File Attachments**: Upload supporting documents
- **Customer & Cost Center Management**: Track projects and funding sources

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React with modern CSS
- **Database**: SQLite (development), easily configurable for production
- **Containerization**: Docker & Docker Compose

## Quick Start

### Using Docker (Recommended)

1. **Prerequisites**: Make sure Docker and Docker Compose are installed
2. **Start the application**:
   - **Windows**: Double-click `start.bat` or run in PowerShell: `.\start.bat`
   - **Linux/Mac**: Run `chmod +x start.sh && ./start.sh`
   - **Manual**: `docker-compose up --build`

3. **Access the application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

4. **Stop the application**: `docker-compose down`

## Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## Project Structure

```
reimbursement-app/
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   └── uploads/      # File uploads
├── frontend/         # React frontend
├── docker-compose.yml
└── README.md
```