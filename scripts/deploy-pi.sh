#!/bin/bash

# Raspberry Pi Deployment Script
# Run this script on the Raspberry Pi after pulling the production branch

set -e

echo "🚀 Starting Asset Manager deployment on Raspberry Pi..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on production branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "production" ]; then
    print_error "Not on production branch. Current branch: $CURRENT_BRANCH"
    print_status "Switching to production branch..."
    git fetch origin
    git checkout production
    git pull origin production
fi

# Check if build directories exist
if [ ! -d "apps/frontend/build" ]; then
    print_error "Frontend build directory not found!"
    print_error "Make sure GitHub Actions ran successfully and build files are committed."
    exit 1
fi

if [ ! -d "apps/backend/dist" ]; then
    print_error "Backend dist directory not found!"
    print_error "Make sure GitHub Actions ran successfully and build files are committed."
    exit 1
fi

# Deploy frontend
print_status "Deploying frontend to Nginx..."
sudo cp -r apps/frontend/build/* /var/www/asset-manager/
print_status "Frontend deployed successfully"

# Install backend dependencies (production only)
print_status "Installing backend production dependencies..."
cd apps/backend
npm ci --only=production
cd ../..

# Restart backend service
print_status "Restarting backend service (PM2)..."
pm2 restart asset-manager-backend || {
    print_warning "Failed to restart existing process. Starting new process..."
    pm2 start apps/backend/dist/main.js --name asset-manager-backend
}

# Reload Nginx
print_status "Reloading Nginx configuration..."
sudo nginx -t && sudo systemctl reload nginx

# Show status
print_status "Checking service status..."
echo ""
echo "📊 PM2 Status:"
pm2 list | grep asset-manager-backend

echo ""
echo "🌐 Nginx Status:"
sudo systemctl is-active nginx

echo ""
echo "💾 Memory Usage:"
free -h

echo ""
print_status "✅ Deployment completed successfully!"
print_status "🌍 Your application should now be running on http://your-pi-ip"
print_status "📝 Check logs with: pm2 logs asset-manager-backend"