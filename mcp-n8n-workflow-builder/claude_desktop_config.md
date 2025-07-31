# MCP Configuration for Claude Desktop / Cursor

This document explains how to configure Claude Desktop or Cursor to work with the n8n MCP server.

## Option 1: Local Server (stdio transport)

For development and testing, you can run the MCP server locally:

### Claude Desktop Configuration

Add this to your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "command": "node",
      "args": ["path/to/mcp-n8n-workflow-builder/dist/index.js"],
      "env": {
        "N8N_API_KEY": "your-n8n-api-key",
        "N8N_BASE_URL": "http://localhost:5678"
      }
    }
  }
}
```

### Cursor Configuration

For Cursor (local stdio transport), add to your `.cursorrules` or configure in settings:

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "command": "node",
      "args": ["./mcp-n8n-workflow-builder/dist/index.js"],
      "env": {
        "N8N_API_KEY": "your-n8n-api-key",
        "N8N_BASE_URL": "http://localhost:5678"
      }
    }
  }
}
```

## Option 2: Streaming HTTP Server (for Cursor)

**This is the recommended option for Cursor IDE integration.**

### 1. Start the MCP server in standalone mode:

```bash
cd mcp-n8n-workflow-builder
MCP_STANDALONE=true MCP_PORT=3456 npm start
```

### 2. Configure Cursor for streaming transport:

Add this to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "url": "http://localhost:3456/sse",
      "env": {
        "N8N_API_KEY": "your-n8n-api-key", 
        "N8N_BASE_URL": "http://localhost:5678"
      }
    }
  }
}
```

### 3. Test the connection:

You can test if the streaming server is working by:

1. **Health check**: Visit `http://localhost:3456/health`
2. **SSE endpoint**: Visit `http://localhost:3456/sse` (should start streaming)
3. **Tools list**: POST to `http://localhost:3456/messages?sessionId=<your-session-id>`

Example tools list request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

## Environment Variables

Regardless of which option you choose, you'll need these environment variables:

```bash
# Required
N8N_API_KEY=your-n8n-api-key
N8N_BASE_URL=http://localhost:5678

# Optional
MCP_STANDALONE=true           # Set to true for streaming HTTP mode
MCP_PORT=3456                # Port for HTTP server (default: 3456)
DEBUG=true                   # Enable debug logging
N8N_ENVIRONMENT=development  # Environment name
```

## Troubleshooting

### For stdio transport issues:
- Make sure the path to `dist/index.js` is correct
- Check that Node.js is in your PATH
- Verify environment variables are set correctly

### For streaming transport issues:
- Ensure the server is running in standalone mode (`MCP_STANDALONE=true`)
- Check that port 3456 (or your chosen port) is not in use
- Verify the SSE endpoint is accessible at `http://localhost:3456/sse`
- Look for CORS issues in browser developer tools

### Common Issues:
1. **"Loading tools..." forever**: Usually indicates transport mismatch. Try streaming option.
2. **Connection refused**: Make sure the MCP server is running and the port is correct.
3. **401/403 errors**: Check your N8N_API_KEY is valid.
4. **Tools not appearing**: Verify n8n is running and accessible at N8N_BASE_URL.

## Server Endpoints

When running in streaming mode, the server exposes:

- `GET /health` - Health check
- `GET /sse` - SSE endpoint for MCP streaming transport  
- `POST /messages` - Message endpoint for MCP communication
- `POST /mcp` - Legacy JSON-RPC endpoint (backwards compatibility)

The streaming transport (`/sse` + `/messages`) is what Cursor expects and should resolve the "Loading tools..." issue. 