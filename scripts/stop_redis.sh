#!/usr/bin/env bash
set -eo pipefail

# Find Redis containers
CONTAINERS=$(docker ps -a --filter "name=portfoliostr-redis" --format "{{.ID}}")

if [[ -z "$CONTAINERS" ]]; then
  echo "No portfoliostr-redis containers found"
  exit 0
fi

# Stop and remove
echo "Stopping and removing Redis containers..."
echo "$CONTAINERS" | xargs docker rm -f

echo "Redis containers stopped and removed"
