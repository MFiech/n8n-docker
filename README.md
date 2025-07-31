# n8n + MCP Server Docker Setup

This repository contains a complete Docker setup for running n8n with an MCP (Model Context Protocol) server that enables Cursor IDE integration.

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone git@github.com:MFiech/n8n-docker.git
cd n8n-docker
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` and add your n8n API key:
```bash
N8N_API_KEY=your-actual-api-key-here
```

### 3. Start Services
```bash
./start-mcp.sh
```

## 📋 Services

### n8n Workflow Automation
- **URL**: http://localhost:5678
- **Database**: SQLite (simple, file-based)
- **Features**: Puppeteer support, Chrome optimizations

### MCP Server (Cursor Integration)
- **URL**: http://localhost:3456
- **Tools**: 16 n8n workflow management tools
- **Integration**: Configured for Cursor IDE

## 🔧 Available Tools in Cursor

The MCP server provides these tools for managing n8n workflows:

**Workflow Management:**
- `list_workflows` - List all workflows
- `create_workflow` - Create new workflow
- `get_workflow` - Get workflow by ID
- `update_workflow` - Update existing workflow
- `delete_workflow` - Delete workflow
- `activate_workflow` - Activate workflow
- `deactivate_workflow` - Deactivate workflow

**Execution Management:**
- `list_executions` - List workflow executions
- `get_execution` - Get execution details
- `delete_execution` - Delete execution

**Tag Management:**
- `create_tag` - Create workflow tag
- `get_tags` - List all tags
- `get_tag` - Get tag by ID
- `update_tag` - Update tag
- `delete_tag` - Delete tag

## 🔐 Cursor Configuration

The MCP server is pre-configured in `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "n8n-workflow-builder": {
      "url": "http://localhost:3456/sse",
      "env": {
        "N8N_API_KEY": "your-api-key-here",
        "N8N_BASE_URL": "http://localhost:5678"
      }
    }
  }
}
```

## 📁 File Structure

```
├── docker-compose-simple.yml    # Main Docker Compose configuration
├── docker-compose-secure.yml    # Template with environment variables
├── mcp-n8n-workflow-builder/    # MCP server source code
├── start-mcp.sh                 # Start both services
├── stop-mcp.sh                  # Stop both services
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## 🛠 Scripts

- `./start-mcp.sh` - Start both n8n and MCP server
- `./stop-mcp.sh` - Stop both services
- `./setup-autostart.sh` - Setup auto-start on system boot

## 🔒 Security Notes

- **API Keys**: Never commit `.env` files to git
- **Volumes**: n8n data is persisted in `n8n-mcp_n8n_data` volume
- **Network**: Services communicate via Docker internal network

## 🐛 Troubleshooting

### Services Not Starting
```bash
# Check Docker is running
docker info

# Check service status
docker-compose -f docker-compose-simple.yml ps

# View logs
docker-compose -f docker-compose-simple.yml logs
```

### Cursor Not Loading Tools
1. Restart Cursor to refresh MCP connection
2. Check MCP server is running: `curl http://localhost:3456/sse`
3. Verify Cursor MCP configuration

### Port Conflicts
If ports 5678 or 3456 are in use:
1. Stop conflicting services: `lsof -i :5678`
2. Or modify ports in `docker-compose-simple.yml`

## 📊 Monitoring

- **n8n Interface**: http://localhost:5678
- **MCP Health Check**: http://localhost:3456/health
- **Docker Logs**: `docker-compose -f docker-compose-simple.yml logs`

## 🔄 Updates

To update the setup:
```bash
git pull
docker-compose -f docker-compose-simple.yml down
docker-compose -f docker-compose-simple.yml up -d --build
```