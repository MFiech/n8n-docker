#!/bin/bash

echo "Setting up system for Puppeteer/Chrome optimization..."

# Increase shared memory
echo "kernel.shmmax = 268435456" | sudo tee -a /etc/sysctl.conf
echo "kernel.shmall = 268435456" | sudo tee -a /etc/sysctl.conf

# Increase virtual memory limits
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf

# Increase file descriptor limits
echo "fs.file-max = 2097152" | sudo tee -a /etc/sysctl.conf

# Apply changes
sudo sysctl -p

# Update Docker daemon configuration
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "default-shm-size": "2G",
  "default-ulimits": {
    "memlock": {
      "hard": -1,
      "name": "memlock",
      "soft": -1
    },
    "nofile": {
      "hard": 65536,
      "name": "nofile", 
      "soft": 65536
    }
  }
}
EOF

echo "System optimization complete. Please restart Docker daemon:"
echo "sudo systemctl restart docker"