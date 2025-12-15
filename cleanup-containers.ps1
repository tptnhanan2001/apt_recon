# PowerShell script to clean up old containers
# Run this script if you encounter container name conflicts

Write-Host "Stopping and removing old containers..." -ForegroundColor Yellow

# Stop all containers with the project name
docker-compose down

# Remove containers by name if they still exist
$containerNames = @(
    "ars0n-framework-v2-api-1",
    "ars0n-framework-v2-db-1",
    "ars0n-framework-v2-client-1",
    "ars0n-framework-v2-ai-service-1",
    "ars0n-framework-v2-assetfinder-1",
    "ars0n-framework-v2-metabigor-1",
    "ars0n-framework-v2-sublist3r-1",
    "ars0n-framework-v2-subfinder-1",
    "ars0n-framework-v2-shuffledns-1",
    "ars0n-framework-v2-cewl-1",
    "ars0n-framework-v2-gospider-1",
    "ars0n-framework-v2-subdomainizer-1",
    "ars0n-framework-v2-nuclei-1",
    "ars0n-framework-v2-katana-1",
    "ars0n-framework-v2-httpx-1",
    "ars0n-framework-v2-dnsx-1",
    "ars0n-framework-v2-ffuf-1",
    "ars0n-framework-v2-github-recon-1",
    "ars0n-framework-v2-cloud_enum-1"
)

foreach ($name in $containerNames) {
    Write-Host "Checking container: $name" -ForegroundColor Cyan
    $container = docker ps -a --filter "name=$name" --format "{{.ID}}"
    if ($container) {
        Write-Host "  Removing container: $name" -ForegroundColor Red
        docker rm -f $name 2>$null
    }
}

Write-Host "`nCleanup completed!" -ForegroundColor Green
Write-Host "You can now run: docker-compose up -d" -ForegroundColor Green

