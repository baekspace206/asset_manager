# 💰 Asset Manager - Complete Financial Management Suite

A full-stack financial management application with asset portfolio tracking and household expense management, built with NestJS and React.

## ✨ Features Overview

### 🎯 **Asset Portfolio Management**
- **Real-time Portfolio Tracking:** Monitor your financial assets with live updates
- **Advanced Analytics:** Growth charts, performance metrics, and historical snapshots
- **Asset Categorization:** Organize investments by type with detailed notes
- **Audit Logging:** Complete transaction history with user tracking

### 📊 **Household Ledger System** ⭐ NEW
- **Monthly Expense Tracking:** Categorize and track all household expenses
- **Visual Analytics:** Color-coded category breakdowns with percentage distributions
- **Interactive Dashboard:** Collapsible monthly views with detailed statistics
- **Smart Insights:** Average spending, transaction counts, and trend analysis

### 👥 **Advanced User Management**
- **Role-Based Access Control:** Admin, User roles with granular permissions
- **Permission Levels:** VIEW (read-only) and EDIT (full access) permissions
- **User Approval Workflow:** Admin approval system for new registrations
- **JWT Authentication:** Secure token-based authentication with auto-refresh

### 🎨 **Modern User Experience**
- **Responsive Design:** Mobile-first approach with desktop optimization
- **Interactive Components:** Modal forms, progress bars, and visual feedback
- **Real-time Updates:** Live data synchronization across all components
- **Professional UI:** Clean, intuitive interface with accessibility support

## 🏗️ Technical Architecture

```
📦 Full Stack Architecture
├── 🚀 Backend (NestJS + TypeScript)
│   ├── 🗃️ TypeORM + SQLite Database
│   ├── 🔐 JWT Authentication System
│   ├── 🛡️ Role-Based Access Guards
│   ├── 📝 Comprehensive Audit Logging
│   └── 🧪 RESTful API with Validation
├── ⚛️ Frontend (React + TypeScript)
│   ├── 📱 Responsive UI Components
│   ├── 🎯 Context API State Management
│   ├── 🔄 Axios HTTP Client
│   └── 🎨 Modern CSS Design
└── 🏗️ Infrastructure
    ├── 🌐 Nginx Reverse Proxy
    ├── 📦 PM2 Process Management
    └── 🔄 Automated Deployment
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ with npm/pnpm
- **Nginx** for reverse proxy
- **PM2** for process management (optional)
- **Git** for version control

### 🔧 Installation

1. **Clone Repository:**
   ```bash
   git clone https://github.com/baekspace206/asset_manager.git
   cd asset_manager
   ```

2. **Install Dependencies:**
   ```bash
   # Install all dependencies
   npm run install:all
   
   # Or install individually
   cd apps/backend && pnpm install && cd ../frontend && npm install
   ```

3. **Development Mode:**
   ```bash
   # Run both frontend and backend
   npm run dev
   
   # Access the application
   # Frontend: http://localhost:3001
   # Backend API: http://localhost:3000
   ```

### 🌐 Production Deployment

#### Backend Setup
```bash
cd apps/backend
pnpm install
pnpm run build

# Using PM2 (recommended)
pm2 start dist/main.js --name "asset-manager-backend"
pm2 save
pm2 startup
```

#### Frontend Build & Deploy
```bash
cd apps/frontend
npm install

# Build with memory optimization
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Deploy to nginx
sudo cp -r build/* /var/www/asset-manager/
sudo systemctl reload nginx
```

#### Nginx Configuration
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
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔐 Default Access & Security

### Authentication
- **Admin Account:** `jaemin` / `admin123`
- **Test User:** `test` / `test123` (VIEW permission)
- **JWT Tokens:** 1-hour expiration with automatic refresh

### Permission System
- **ADMIN Role:** Full system access + user management
- **USER Role:** Asset/ledger access based on permission level
- **VIEW Permission:** Read-only access to all data
- **EDIT Permission:** Full CRUD operations

## 📱 Feature Guide

### 💼 Asset Portfolio
1. **Add Assets:** Click "Add Financial Asset" → Enter details
2. **Track Growth:** View portfolio charts and historical data
3. **Monitor Changes:** Real-time updates with audit trail
4. **Generate Reports:** Create snapshots for analysis

### 📊 Household Ledger
1. **Record Expenses:** Use "등록" button → Add expense details
2. **Categorize:** Organize by category (식비, 교통비, 문화생활, etc.)
3. **Visual Analysis:** View monthly breakdowns with color-coded cards
4. **Track Trends:** Monitor spending patterns and averages

### 👥 User Management (Admin)
1. **Approve Users:** Review and approve new registrations
2. **Assign Permissions:** Grant VIEW or EDIT access levels
3. **Monitor Activity:** View user statistics and audit logs
4. **System Health:** Track application usage and performance

## 🛠️ Development

### Project Structure
```
asset_manager/
├── apps/
│   ├── backend/                    # NestJS API
│   │   ├── src/
│   │   │   ├── assets/            # Asset management
│   │   │   ├── ledger/            # Household ledger ⭐
│   │   │   ├── users/             # User management
│   │   │   ├── auth/              # Authentication
│   │   │   ├── audit/             # Activity logging
│   │   │   └── portfolio/         # Portfolio analytics
│   │   └── dist/                  # Built files
│   └── frontend/                  # React App
│       ├── src/
│       │   ├── components/        # UI Components
│       │   │   ├── Ledger.tsx     # Expense tracking ⭐
│       │   │   ├── LedgerModal.tsx # Add/Edit expenses ⭐
│       │   │   └── AdminDashboard.tsx # User management ⭐
│       │   ├── contexts/          # React Context
│       │   └── services/          # API integration
│       └── build/                 # Production build
├── nginx.conf                     # Nginx configuration
├── DEPLOYMENT.md                  # Detailed deployment guide
└── README.md                      # This file
```

### 🔌 API Reference
```
Authentication:
POST /api/auth/login               # User login
POST /api/auth/register            # User registration
GET  /api/auth/profile             # User profile with permissions

Assets:
GET    /api/assets                 # List all assets
POST   /api/assets                 # Create asset (EDIT permission)
PATCH  /api/assets/:id             # Update asset (EDIT permission)
DELETE /api/assets/:id             # Delete asset (EDIT permission)

Household Ledger: ⭐
GET    /api/ledger                 # List entries
GET    /api/ledger/stats           # Monthly statistics
GET    /api/ledger/categories      # Category list
POST   /api/ledger                 # Create entry (EDIT permission)
PATCH  /api/ledger/:id             # Update entry (EDIT permission)
DELETE /api/ledger/:id             # Delete entry (EDIT permission)

User Management (Admin only):
GET  /api/users/admin/pending      # Pending user approvals
GET  /api/users/admin/all          # All users
POST /api/users/admin/approve/:id  # Approve user
POST /api/users/admin/reject/:id   # Reject user
PUT  /api/users/admin/permission/:id # Update permissions
```

### 🧪 Development Commands
```bash
# Root level
npm run dev                        # Start both apps
npm run backend:dev               # Backend only
npm run frontend:dev              # Frontend only
npm run install:all               # Install all dependencies

# Backend (apps/backend)
pnpm run start:dev                # Development with hot reload
pnpm run build                    # Production build
pnpm run test                     # Unit tests
pnpm run lint                     # Code linting

# Frontend (apps/frontend)
npm start                         # Development server
npm run build                     # Production build
npm test                          # React tests
```

## 📊 Database Schema

### Core Tables
- **users:** User accounts, roles, permissions, approval status
- **assets:** Financial assets with categories and audit tracking
- **ledger_entries:** ⭐ Household expenses with categorization
- **portfolio_snapshots:** Historical portfolio value tracking
- **audit_logs:** Complete activity audit trail

### SQLite Features
- **Auto-sync:** Schema updates automatically applied
- **Performance:** Optimized queries with proper indexing
- **Backup:** Automated backup strategies supported
- **Migration:** TypeORM handles schema evolution

## 🚨 Troubleshooting

### Common Issues
1. **Memory Issues:** Use `NODE_OPTIONS="--max-old-space-size=2048"`
2. **Build Failures:** Add swap space: `sudo fallocate -l 2G /swapfile`
3. **API Errors:** Check nginx proxy: `/api/` → `localhost:3000/`
4. **Permission Denied:** Verify user approval status and permission level

### Log Locations
- **Backend:** `pm2 logs asset-manager-backend`
- **Nginx:** `/var/log/nginx/access.log`
- **Frontend:** Browser DevTools Console

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

### Guidelines
- **Code Style:** Follow ESLint/Prettier configuration
- **Testing:** Add tests for new features
- **Documentation:** Update relevant docs
- **Security:** Follow OWASP best practices

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NestJS Community** - Amazing backend framework
- **React Team** - Powerful UI library
- **TypeORM** - Excellent database abstraction
- **Claude Code** - Development assistance

---

**🚀 Production-Ready Financial Management Suite**

Built with ❤️ by **baekspace206** | Ready for deployment with comprehensive monitoring and documentation!

### Recent Updates ⭐
- ✨ **Household Ledger System** with visual analytics
- 🎨 **Enhanced UI/UX** with color-coded categories
- 🔒 **Advanced Permission System** with granular controls
- 📊 **Interactive Dashboards** with real-time statistics
- 🌐 **Production Deployment** with nginx and PM2
- 📚 **Complete Documentation** with deployment guides