#!/bin/bash

echo "Deploying n8n with Puppeteer fixes..."

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Remove old images and containers
echo "Cleaning up old resources..."
docker system prune -f
docker volume prune -f

# Build new image
echo "Building optimized n8n image..."
docker-compose build --no-cache

# Start services
echo "Starting services..."
docker-compose up -d

# Wait for services to start
echo "Waiting for services to start..."
sleep 30

# Check status
echo "Checking container status..."
docker-compose ps

# Show logs
echo "Recent logs:"
docker-compose logs n8n --tail=50

echo ""
echo "Deployment complete!"
echo "n8n should be available at http://localhost:5678"
echo ""
echo "To monitor logs: docker-compose logs -f n8n"
echo "To restart: docker-compose restart n8n"