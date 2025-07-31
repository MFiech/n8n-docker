#!/bin/bash

echo "🚀 Starting n8n and MCP server..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start the services
docker-compose -f docker-compose-simple.yml up -d

# Wait a moment for services to start
sleep 3

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose-simple.yml ps

# Test MCP server
echo ""
echo "🔍 Testing MCP server..."
if curl -s -f -X POST http://localhost:3456/sse -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"tools/list","id":1}' > /dev/null; then
    echo "✅ MCP server is running and accessible at http://localhost:3456"
else
    echo "❌ MCP server is not responding"
fi

# Test n8n
echo ""
echo "🔍 Testing n8n..."
if curl -s -f http://localhost:5678 > /dev/null; then
    echo "✅ n8n is running and accessible at http://localhost:5678"
else
    echo "❌ n8n is not responding"
fi

echo ""
echo "🎉 Setup complete! Your MCP server should now be available in Cursor."
echo "   If Cursor still shows 'Loading tools...', restart Cursor to refresh the connection." 