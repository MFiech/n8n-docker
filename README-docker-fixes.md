# Puppeteer Docker Fixes for n8n

This directory contains all the necessary files to fix Puppeteer Docker issues in your n8n workflow.

## Files Created

1. **docker-compose.yml** - Optimized Docker Compose configuration with Chrome support
2. **Dockerfile.n8n** - Custom n8n image with Chrome pre-installed
3. **setup-system.sh** - System optimization script for Docker/Chrome
4. **deploy-n8n.sh** - Complete deployment script with cleanup
5. **test-chrome.sh** - Chrome functionality test script
6. **quick-fix.sh** - Quick fix without rebuilding (temporary)
7. **puppeteer-config.json** - Puppeteer configuration for n8n node

## Implementation Steps

### Option 1: Full Implementation (Recommended)

1. **Make scripts executable:**
```bash
chmod +x *.sh
```

2. **Run system setup:**
```bash
./setup-system.sh
```

3. **Restart Docker daemon:**
```bash
sudo systemctl restart docker
```

4. **Deploy optimized n8n:**
```bash
./deploy-n8n.sh
```

5. **Test Chrome functionality:**
```bash
./test-chrome.sh
```

### Option 2: Quick Fix (Temporary)

If you want to try fixing without rebuilding:

```bash
chmod +x quick-fix.sh
./quick-fix.sh
```

## Puppeteer Node Configuration

In your n8n Puppeteer node, use these settings:

### Global Options:
```json
{
  "headless": true,
  "args": [
    "--no-sandbox",
    "--disable-setuid-sandbox", 
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--single-process"
  ],
  "timeout": 60000
}
```

### Node Options:
```json
{
  "waitUntil": "networkidle0",
  "timeToWait": 3000
}
```

## Key Features

### Docker Optimizations:
- ✅ Chrome pre-installed with all dependencies
- ✅ Shared memory optimization (2GB)
- ✅ Proper security capabilities (SYS_ADMIN)
- ✅ Resource limits and reservations
- ✅ Xvfb virtual display for headless operation

### System Optimizations:
- ✅ Increased virtual memory limits
- ✅ Proper file descriptor limits
- ✅ Docker daemon optimizations
- ✅ Shared memory configuration

### Error Handling:
- ✅ Retry mechanisms
- ✅ Fallback configurations
- ✅ Comprehensive logging
- ✅ Health checks

## Troubleshooting

### If Puppeteer still fails:

1. **Check container logs:**
```bash
docker-compose logs n8n -f
```

2. **Verify Chrome installation:**
```bash
docker-compose exec n8n google-chrome-stable --version
```

3. **Test with minimal settings:**
   - Use only `--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage`

4. **Alternative: Use HTTP Request instead of Puppeteer**
   - Replace Puppeteer node with HTTP Request node
   - Add HTML cleaning code node

### Common Issues:

- **Out of memory**: Increase memory limits in docker-compose.yml
- **Permission denied**: Ensure SYS_ADMIN capability is added
- **Chrome crashes**: Check shared memory size (shm_size: 2gb)

## Monitoring

### Check resource usage:
```bash
docker stats
```

### Monitor logs:
```bash
docker-compose logs -f n8n
```

### Container health:
```bash
docker-compose ps
```

## Support

If issues persist, the configuration includes fallback options and comprehensive error handling to ensure your workflow continues running even if Puppeteer encounters problems.