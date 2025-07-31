#!/bin/bash

echo "🔧 Setting up auto-start for n8n MCP server..."

# Copy the plist to the correct location
cp com.n8n.mcp.plist ~/Library/LaunchAgents/

# Load the launch agent
launchctl load ~/Library/LaunchAgents/com.n8n.mcp.plist

echo ""
echo "✅ Auto-start configured!"
echo "   The MCP server will now start automatically when you log in."
echo ""
echo "To disable auto-start later, run:"
echo "   launchctl unload ~/Library/LaunchAgents/com.n8n.mcp.plist"
echo "   rm ~/Library/LaunchAgents/com.n8n.mcp.plist" 