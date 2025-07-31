# MCP Server Automation Setup

This guide explains how to automate the startup of your n8n MCP server so you don't have to start it manually every time.

## Current Status

✅ **Fixed**: Port mapping corrected (3456:3456)  
✅ **Fixed**: Docker restart policies added (`restart: unless-stopped`)  
✅ **Ready**: MCP server with 16 tools working correctly  

## Quick Start

### Option 1: Manual Control (Recommended for Development)

Start the services when you need them:
```bash
./start-mcp.sh
```

Stop the services when done:
```bash
./stop-mcp.sh
```

### Option 2: Auto-start on System Boot (Docker)

Your `docker-compose.yml` is already configured with `restart: unless-stopped`, which means:
- Services automatically restart if they crash
- Services start when Docker Desktop starts (if Docker is set to start on login)

To enable Docker Desktop auto-start:
1. Open Docker Desktop
2. Go to Settings → General
3. Check "Start Docker Desktop when you log in"

### Option 3: Auto-start on Login (macOS Launch Agent)

For complete automation, install the Launch Agent:
```bash
./setup-autostart.sh
```

This will:
- Start the MCP server automatically when you log in
- Handle Docker startup if needed
- Create logs at `/tmp/n8n-mcp.log`

## Troubleshooting

### Cursor Shows "Loading tools..."

1. Check if services are running: `docker-compose ps`
2. Test MCP server: `curl http://localhost:3456/sse -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'`
3. Restart Cursor to refresh the connection
4. Check Cursor MCP logs for connection errors

### Services Not Starting

1. Check if Docker is running: `docker info`
2. Start Docker Desktop if needed
3. Run `./start-mcp.sh` to see detailed status

### Port Conflicts

If port 3456 is in use:
1. Stop other services using the port: `lsof -i :3456`
2. Or modify `docker-compose.yml` to use a different port
3. Update Cursor's `~/.cursor/mcp.json` with the new port

## Service URLs

- **n8n Interface**: http://localhost:5678
- **MCP Server**: http://localhost:3456
- **MCP Tools**: 16 workflow management tools available

## Configuration Files

- `docker-compose.yml`: Service definitions with restart policies
- `~/.cursor/mcp.json`: Cursor MCP client configuration
- `~/Library/LaunchAgents/com.n8n.mcp.plist`: Auto-start configuration (if installed)

## Available Tools

Your MCP server provides 16 n8n workflow management tools:

1. **Workflow Management**: list, create, get, update, delete, activate, deactivate
2. **Execution Management**: list, get, delete executions  
3. **Tag Management**: create, get, update, delete tags

All tools support multi-instance n8n setups and include proper error handling.

## Logs and Monitoring

- **Docker logs**: `docker-compose logs mcp-server`
- **Auto-start logs**: `/tmp/n8n-mcp.log` (if using Launch Agent)
- **Cursor MCP logs**: Available in Cursor's MCP panel

## Recommended Workflow

For development:
1. Use `./start-mcp.sh` when you start working
2. Use `./stop-mcp.sh` when you're done
3. Keep Docker Desktop set to start on login
4. Use auto-start only if you use the MCP server daily 