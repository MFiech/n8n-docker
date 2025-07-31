#!/bin/bash

echo "🛑 Stopping n8n and MCP server..."

# Stop the services
docker-compose down

echo ""
echo "✅ Services stopped successfully." 