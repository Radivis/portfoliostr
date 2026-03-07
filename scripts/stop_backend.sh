#!/usr/bin/env bash
set -eo pipefail

# Find backend containers
CONTAINERS=$(docker ps -a --filter "name=portfoliostr-backend" --format "{{.ID}}")

if [[ -z "$CONTAINERS" ]]; then
  echo "No portfoliostr-backend containers found"
  exit 0
fi

# Stop and remove
echo "Stopping and removing backend containers..."
echo "$CONTAINERS" | xargs docker rm -f

echo "Backend containers stopped and removed"
