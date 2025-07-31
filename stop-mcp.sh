#!/bin/bash

echo "🛑 Stopping n8n and MCP server..."

# Stop the services
docker-compose -f docker-compose-simple.yml down

echo ""
echo "✅ Services stopped successfully." 