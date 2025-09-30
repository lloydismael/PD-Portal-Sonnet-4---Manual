# Company Reimbursement Application

A modern, containerized web application for managing company reimbursements, cash advances, and liquidations.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/lloydismael/PD-Portal-Sonnet-4---Manual)
[![Docker Hub - Frontend](https://img.shields.io/badge/Docker%20Hub-Frontend-blue?style=flat-square&logo=docker)](https://hub.docker.com/r/lloydismael12/reimbursement-frontend)
[![Docker Hub - Backend](https://img.shields.io/badge/Docker%20Hub-Backend-blue?style=flat-square&logo=docker)](https://hub.docker.com/r/lloydismael12/reimbursement-backend)

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

## 🚀 Deployment Options

### Option 1: Using Docker Compose (Recommended)
Clone the repository and use the provided docker-compose.yml:
```bash
git clone https://github.com/lloydismael/PD-Portal-Sonnet-4---Manual.git
cd PD-Portal-Sonnet-4---Manual/reimbursement-app
docker-compose up -d
```

### Option 2: Using Pre-built Docker Images from DockerHub
Run the application using pre-built images without cloning the repository:

```bash
# Create a docker-compose.yml file with the following content:
version: '3.8'

services:
  backend:
    image: lloydismael12/reimbursement-backend:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./app.db
    volumes:
      - backend_uploads:/app/uploads
      - backend_db:/app
    networks:
      - reimbursement-network

  frontend:
    image: lloydismael12/reimbursement-frontend:latest
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - reimbursement-network

volumes:
  backend_uploads:
  backend_db:

networks:
  reimbursement-network:
    driver: bridge
```

Then run:
```bash
docker-compose up -d
```

### Option 3: Manual Docker Run Commands
```bash
# Create network
docker network create reimbursement-network

# Run backend
docker run -d \
  --name reimbursement-backend \
  --network reimbursement-network \
  -p 8000:8000 \
  -v backend_uploads:/app/uploads \
  -v backend_db:/app \
  lloydismael12/reimbursement-backend:latest

# Run frontend
docker run -d \
  --name reimbursement-frontend \
  --network reimbursement-network \
  -p 3000:3000 \
  lloydismael12/reimbursement-frontend:latest
```

### Available Docker Tags
- `lloydismael12/reimbursement-backend:latest` - Latest backend image
- `lloydismael12/reimbursement-backend:v1.0` - Version 1.0 backend
- `lloydismael12/reimbursement-frontend:latest` - Latest frontend image  
- `lloydismael12/reimbursement-frontend:v1.0` - Version 1.0 frontend

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

## 🎨 Modern Design Features

This application features a contemporary, modern UI design:

- **Glass Morphism Effects**: Subtle transparency and backdrop blur effects
- **Modern Color Palette**: Deep gradients with blue-purple tones
- **Enhanced Typography**: Inter font family with improved readability
- **Smooth Animations**: CSS transitions with cubic-bezier timing functions
- **Interactive Elements**: Hover effects, floating animations, and pulse effects
- **Professional Layout**: Modern grid systems and card-based design
- **Responsive Design**: Optimized for desktop and mobile devices

## Project Structure

```
reimbursement-app/
├── backend/                 # FastAPI backend
│   ├── app/                # Application code
│   │   ├── main.py        # FastAPI application
│   │   ├── models.py      # Database models
│   │   └── database.py    # Database configuration
│   ├── uploads/           # File uploads directory
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile        # Backend container configuration
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── index.css    # Base styles
│   │   └── modern-styles.css # Modern design system
│   ├── public/          # Static assets
│   ├── package.json     # Node.js dependencies
│   └── Dockerfile       # Frontend container configuration
├── docker-compose.yml     # Multi-container orchestration
├── .gitignore            # Git ignore patterns
└── README.md             # Project documentation
```

## 📦 Repository Information

- **GitHub Repository**: [https://github.com/lloydismael/PD-Portal-Sonnet-4---Manual](https://github.com/lloydismael/PD-Portal-Sonnet-4---Manual)
- **DockerHub Backend**: [https://hub.docker.com/r/lloydismael12/reimbursement-backend](https://hub.docker.com/r/lloydismael12/reimbursement-backend)
- **DockerHub Frontend**: [https://hub.docker.com/r/lloydismael12/reimbursement-frontend](https://hub.docker.com/r/lloydismael12/reimbursement-frontend)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is available for use under standard terms. Please refer to the repository for specific licensing information.