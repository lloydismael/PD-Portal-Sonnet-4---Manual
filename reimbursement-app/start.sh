#!/bin/bash

# Company Reimbursement Application Startup Script

echo "🚀 Starting Company Reimbursement Application..."
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ docker-compose is not installed. Please install Docker Compose."
    exit 1
fi

# Build and start the application
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
backend_status=$(docker-compose ps -q backend | xargs docker inspect -f '{{.State.Status}}')
frontend_status=$(docker-compose ps -q frontend | xargs docker inspect -f '{{.State.Status}}')

if [ "$backend_status" = "running" ] && [ "$frontend_status" = "running" ]; then
    echo "✅ Application started successfully!"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔗 Backend API: http://localhost:8000"
    echo "📚 API Documentation: http://localhost:8000/docs"
    echo ""
    echo "🛑 To stop the application, run: docker-compose down"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
fi