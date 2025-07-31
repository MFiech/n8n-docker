#!/bin/bash

echo "Applying quick Puppeteer fixes without rebuild..."

# Stop container
docker-compose stop n8n

# Update environment and restart
docker-compose up -d n8n

# Install Chrome in running container (temporary fix)
docker-compose exec n8n bash -c "
  sudo apt-get update && \
  sudo apt-get install -y wget gnupg && \
  wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add - && \
  echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list && \
  sudo apt-get update && \
  sudo apt-get install -y google-chrome-stable fonts-liberation
"

echo "Quick fix applied! Restart n8n workflow."