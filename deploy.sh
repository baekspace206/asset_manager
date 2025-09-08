#!/bin/bash

# Asset Manager Deployment Script for Raspberry Pi
# This script pulls the latest code, builds the frontend, and deploys to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/baekjm/assetManager"
FRONTEND_BUILD_DIR="$PROJECT_DIR/apps/frontend/build"
PRODUCTION_DIR="/var/www/asset-manager"
BACKUP_DIR="/var/backups/asset-manager"
PM2_APP_NAME="asset-manager-backend"

# Function to log messages
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as correct user (baekjm)
if [ "$USER" != "baekjm" ]; then
    log_error "This script should be run as the 'baekjm' user"
    exit 1
fi

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Project directory $PROJECT_DIR does not exist"
    log "Please clone the repository first:"
    log "git clone https://github.com/baekspace206/asset_manager.git $PROJECT_DIR"
    exit 1
fi

log "Starting Asset Manager deployment process..."

# Step 1: Navigate to project directory
cd "$PROJECT_DIR" || exit 1
log "Changed to project directory: $PROJECT_DIR"

# Step 2: Pull latest changes from production branch
log "Pulling latest changes from GitHub production branch..."
git fetch origin
git checkout production 2>/dev/null || git checkout -b production origin/production
git reset --hard origin/production
log_success "Successfully pulled latest production build"

# Step 3: Skip building - use pre-built files from GitHub Actions
log "Using pre-built files from GitHub Actions..."
if [ ! -d "$FRONTEND_BUILD_DIR" ]; then
    log_error "Frontend build directory not found - GitHub Actions build may have failed"
    exit 1
fi
log_success "Frontend build files verified"

# Step 5: Create backup of current production files
log "Creating backup of current production files..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
sudo mkdir -p "$BACKUP_DIR"
if [ -d "$PRODUCTION_DIR" ]; then
    sudo cp -r "$PRODUCTION_DIR" "$BACKUP_DIR/backup_$TIMESTAMP"
    log_success "Backup created at $BACKUP_DIR/backup_$TIMESTAMP"
fi

# Step 6: Deploy new frontend files
log "Deploying frontend files to production..."
sudo mkdir -p "$PRODUCTION_DIR"
sudo cp -r "$FRONTEND_BUILD_DIR"/* "$PRODUCTION_DIR/"
sudo chown -R www-data:www-data "$PRODUCTION_DIR"
sudo chmod -R 755 "$PRODUCTION_DIR"
log_success "Frontend files deployed successfully"

# Step 7: Restart backend service
log "Restarting backend service..."
pm2 restart "$PM2_APP_NAME" || {
    log_warning "PM2 restart failed, trying to start..."
    cd "$PROJECT_DIR/apps/backend"
    pm2 start dist/main.js --name "$PM2_APP_NAME"
}

# Wait for backend to start
sleep 5

# Check if backend is running
if pm2 list | grep -q "$PM2_APP_NAME.*online"; then
    log_success "Backend service restarted successfully"
else
    log_error "Backend service failed to start"
    log "Check PM2 logs with: pm2 logs $PM2_APP_NAME"
fi

# Step 8: Test nginx configuration and reload
log "Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    log "Reloading nginx..."
    sudo systemctl reload nginx
    log_success "Nginx reloaded successfully"
else
    log_error "Nginx configuration test failed"
    exit 1
fi

# Step 9: Health check
log "Performing health check..."
sleep 3

# Check if nginx is running
if sudo systemctl is-active --quiet nginx; then
    log_success "Nginx is running"
else
    log_error "Nginx is not running"
fi

# Check if backend is responding (assuming it runs on port 3000)
if curl -f -s http://localhost:3000/health > /dev/null 2>&1; then
    log_success "Backend health check passed"
else
    log_warning "Backend health check failed (this might be normal if no health endpoint exists)"
fi

# Step 10: Cleanup old backups (keep last 5)
log "Cleaning up old backups..."
if [ -d "$BACKUP_DIR" ]; then
    sudo find "$BACKUP_DIR" -name "backup_*" -type d | sort -r | tail -n +6 | sudo xargs rm -rf
    log_success "Old backups cleaned up"
fi

# Final status
log_success "Deployment completed successfully!"
log "Frontend deployed to: $PRODUCTION_DIR"
log "Backend service: $PM2_APP_NAME"
log "Access your application at: http://$(hostname -I | awk '{print $1}')"

# Show system status
echo ""
log "=== Current System Status ==="
echo "Memory usage:"
free -h
echo ""
echo "PM2 processes:"
pm2 list
echo ""
echo "Nginx status:"
sudo systemctl status nginx --no-pager -l