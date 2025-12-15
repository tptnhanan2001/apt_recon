#!/bin/bash
# Bash script to clean up old containers
# Run this script if you encounter container name conflicts

echo "Stopping and removing old containers..."

# Stop all containers with the project name
docker-compose down

# Remove containers by name if they still exist
container_names=(
    "ars0n-framework-v2-api-1"
    "ars0n-framework-v2-db-1"
    "ars0n-framework-v2-client-1"
    "ars0n-framework-v2-ai-service-1"
    "ars0n-framework-v2-assetfinder-1"
    "ars0n-framework-v2-metabigor-1"
    "ars0n-framework-v2-sublist3r-1"
    "ars0n-framework-v2-subfinder-1"
    "ars0n-framework-v2-shuffledns-1"
    "ars0n-framework-v2-cewl-1"
    "ars0n-framework-v2-gospider-1"
    "ars0n-framework-v2-subdomainizer-1"
    "ars0n-framework-v2-nuclei-1"
    "ars0n-framework-v2-katana-1"
    "ars0n-framework-v2-httpx-1"
    "ars0n-framework-v2-dnsx-1"
    "ars0n-framework-v2-ffuf-1"
    "ars0n-framework-v2-github-recon-1"
    "ars0n-framework-v2-cloud_enum-1"
)

for name in "${container_names[@]}"; do
    echo "Checking container: $name"
    container_id=$(docker ps -a --filter "name=$name" --format "{{.ID}}" 2>/dev/null)
    if [ ! -z "$container_id" ]; then
        echo "  Removing container: $name"
        docker rm -f "$name" 2>/dev/null
    fi
done

echo ""
echo "Cleanup completed!"
echo "You can now run: docker-compose up -d"

