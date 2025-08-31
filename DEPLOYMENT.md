# 🚀 Asset Manager Deployment Guide

Complete deployment setup for the Asset Manager application with household ledger functionality.

## 📋 System Architecture

```
[Nginx :80] → [React Frontend] → [API Proxy /api/*] → [NestJS Backend :3000] → [SQLite DB]
```

## 🏗️ Infrastructure Setup

### 1. Backend (NestJS + SQLite)
```bash
cd apps/backend
pnpm install
pnpm run build
```

**PM2 Process Management:**
```bash
# Start backend with PM2
pm2 start dist/main.js --name "asset-manager-backend"

# Check status
pm2 status

# View logs
pm2 logs asset-manager-backend

# Restart (after code changes)
pnpm run build && pm2 restart asset-manager-backend
```

**Database:** SQLite (`asset.db`) with automatic schema sync

### 2. Frontend (React + TypeScript)
```bash
cd apps/frontend
npm install

# Development
npm start  # Runs on :3001

# Production Build
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

**Memory Requirements:**
- Minimum 2GB RAM recommended for builds
- Swap space configured for memory-constrained environments

### 3. Nginx Configuration

**Location:** `/etc/nginx/sites-available/asset-manager`
```nginx
server {
    listen 80;
    server_name _;

    # React static files
    location / {
        root /var/www/asset-manager;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API proxy to NestJS backend
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Deployment Commands:**
```bash
# Build and deploy frontend
cd apps/frontend
NODE_OPTIONS="--max-old-space-size=2048" npm run build
sudo cp -r build/* /var/www/asset-manager/
sudo systemctl reload nginx
```

## 🔐 Authentication & Permissions

### Default Admin Account
- **Username:** `jaemin`
- **Password:** `admin123`
- **Role:** ADMIN
- **Permission:** EDIT

### User Roles
- **ADMIN:** Full system access, user management
- **USER:** Limited access based on permission level

### Permission Levels
- **VIEW:** Read-only access to data
- **EDIT:** Full CRUD operations

### JWT Configuration
- Secret key: Configurable via `JWT_SECRET` environment variable
- Token expiration: 1 hour
- Auto-refresh on page reload

## 📊 Features Overview

### 💰 Asset Management
- Portfolio tracking with real-time updates
- Asset categorization and notes
- Historical snapshots and growth analysis
- Audit logging for all changes

### 📋 Household Ledger
- Monthly expense tracking by category
- Visual statistics with progress bars
- Color-coded category breakdowns
- Transaction history with search/filter

### 👥 User Management (Admin)
- User approval workflow
- Permission assignment (VIEW/EDIT)
- Account status management
- Usage statistics dashboard

### 🔒 Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Permission-based UI rendering
- Comprehensive audit logging

## 🛠️ Troubleshooting

### Common Issues

1. **Build Out of Memory:**
   ```bash
   # Add swap space
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   
   # Use memory flags
   NODE_OPTIONS="--max-old-space-size=2048" npm run build
   ```

2. **SQLite Date Queries:**
   - Uses TypeORM `Between` for date filtering
   - Compatible with SQLite date functions

3. **API Proxy Issues:**
   - Verify nginx config: `/api/` → `localhost:3000/`
   - Check backend is running on port 3000
   - Confirm PM2 process status

4. **Permission Errors:**
   - Clear localStorage and re-login
   - Check user status (PENDING/APPROVED/REJECTED)
   - Verify permission level (VIEW/EDIT)

### Log Locations
- **Backend:** PM2 logs (`pm2 logs asset-manager-backend`)
- **Nginx:** `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- **Frontend:** Browser DevTools Console

## 📈 Performance Optimization

- **Frontend:** Code splitting, lazy loading
- **Backend:** Database connection pooling, query optimization
- **Nginx:** Static file caching, gzip compression
- **Database:** SQLite with WAL mode for concurrent access

## 🔄 Update Workflow

1. **Backend Updates:**
   ```bash
   cd apps/backend
   pnpm run build
   pm2 restart asset-manager-backend
   ```

2. **Frontend Updates:**
   ```bash
   cd apps/frontend
   NODE_OPTIONS="--max-old-space-size=2048" npm run build
   sudo cp -r build/* /var/www/asset-manager/
   sudo systemctl reload nginx
   ```

3. **Database Migrations:**
   - TypeORM auto-sync enabled
   - Manual backups recommended before major updates

## 📞 Support

For deployment issues or questions:
- Check logs first (PM2, Nginx, Browser)
- Verify all services are running
- Confirm network connectivity and permissions
- Review this deployment guide for common solutions