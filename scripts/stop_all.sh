#!/usr/bin/env bash
set -eo pipefail

# Find all portfoliostr containers
CONTAINERS=$(docker ps -a --filter "name=portfoliostr-" --format "{{.ID}}")

if [[ -z "$CONTAINERS" ]]; then
  echo "No portfoliostr containers found"
  exit 0
fi

# Count containers
COUNT=$(echo "$CONTAINERS" | wc -l)

# Stop and remove
echo "Stopping and removing $COUNT portfoliostr containers..."
echo "$CONTAINERS" | xargs docker rm -f

echo ""
echo "All local development containers stopped and removed:"
echo "  - Backend"
echo "  - Postgres"
echo "  - Redis"
echo "  - Loki (Logging stack)"
echo ""
echo "Note: This does NOT affect docker-compose containers (portfoliostr-*-1)"
