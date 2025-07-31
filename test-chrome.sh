#!/bin/bash

echo "Testing Chrome in Docker container..."

docker-compose exec n8n bash -c "
echo 'Testing Chrome installation...'
/usr/bin/google-chrome-stable --version

echo 'Testing Chrome with Puppeteer flags...'
/usr/bin/google-chrome-stable \
  --no-sandbox \
  --disable-setuid-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  --remote-debugging-port=9222 \
  --headless \
  --dump-dom \
  'https://example.com' | head -10
"

echo "Chrome test complete!"