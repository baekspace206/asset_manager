# Asset Manager - Financial Portfolio Tracker

A full-stack financial asset portfolio management application built with NestJS (backend) and React (frontend). Track your investments, view portfolio growth over time, and monitor all asset changes with comprehensive audit logging.

## Project Structure

```
assetManager/
├── apps/
│   ├── backend/          # NestJS backend API
│   └── frontend/         # React frontend application
├── package.json          # Root package.json for concurrent execution
└── README.md
```

## Features

- 🏦 **Financial Asset Management**: Track houses, deposits, savings, stocks, cryptocurrency, parking accounts, and pensions
- 💰 **Korean Won (₩) Support**: All amounts displayed in Korean currency
- 📈 **Portfolio Growth Tracking**: Visual line charts showing daily portfolio value changes
- 📋 **Audit Logging**: Complete activity log with before/after change tracking
- 🔐 **JWT Authentication**: Secure user registration and login
- 🎨 **Modern UI**: Clean, responsive design with category-based organization
- 🏗️ **Monorepo Structure**: Backend and frontend in organized workspace

## Tech Stack

### Backend
- **NestJS** - Node.js framework
- **TypeORM** - ORM with SQLite database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **better-sqlite3** - SQLite driver

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation


## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm
- pnpm

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd assetManager
```

2. **Install dependencies**
```bash
pnpm install
```

### Running the Application

**Start development servers**
```bash
pnpm dev
```

This will start:
- Backend API server on `http://localhost:3000`
- Frontend development server on `http://localhost:3001`

#### Option 2: Run Individually

**Backend only:**
```bash
npm run backend:dev
# or
cd apps/backend && pnpm run start:dev
```

**Frontend only:**
```bash
npm run frontend:dev
# or
cd apps/frontend && npm start
```

### Available Scripts

- `npm run dev` - Run both frontend and backend concurrently
- `npm run backend:dev` - Run backend only
- `npm run frontend:dev` - Run frontend only
- `npm run install:all` - Install dependencies for both apps

### Backend Scripts (in apps/backend)
- `pnpm run start:dev` - Start development server with hot reload
- `pnpm run build` - Build for production
- `pnpm run start:prod` - Start production server
- `pnpm run test` - Run tests
- `pnpm run lint` - Run linter

### Frontend Scripts (in apps/frontend)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Usage

1. **Start the application**: Run `npm run dev` from the root directory
2. **Open the frontend**: Navigate to `http://localhost:3001`
3. **Register a new user**: Click "Register" and create an account
4. **Login**: Use your credentials to login
5. **Manage assets**: 
   - Click "Add Asset" to create new assets
   - Use Edit/Delete buttons to modify existing assets
   - All data is persisted in the SQLite database

## Production Deployment (Raspberry Pi)

### Prerequisites for Raspberry Pi

1. **Update system**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Node.js 18+ (recommended for ARM64)**
```bash
# Install Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

3. **Install pnpm**
```bash
npm install -g pnpm
```

4. **Install PM2 for process management**
```bash
npm install -g pm2
```

### Deployment Steps

1. **Clone the repository on Raspberry Pi**
```bash
cd /home/pi  # or your preferred directory
git clone <your-repo-url>
cd assetManager
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Build the applications**
```bash
# Build frontend for production
cd apps/frontend
pnpm build
cd ../..

# Build backend
cd apps/backend  
pnpm build
cd ../..
```

4. **Create production environment file**
```bash
# Create .env file in apps/backend/
cd apps/backend
cat > .env << EOF
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
DATABASE_PATH=./asset.db
EOF
cd ../..
```

5. **Create PM2 ecosystem file**
```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'asset-manager-backend',
      cwd: './apps/backend',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF
```

6. **Start the application with PM2**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

7. **Serve frontend with nginx (recommended)**

Install nginx:
```bash
sudo apt install nginx -y
```

Create nginx configuration:
```bash
sudo tee /etc/nginx/sites-available/asset-manager << 'EOF'
server {
    listen 80;
    server_name your-pi-ip-or-domain;

    # Serve frontend static files
    location / {
        root /home/pi/assetManager/apps/frontend/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/asset-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

8. **Update frontend API URL for production**

Edit `apps/frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://your-pi-ip/api';
```

Then rebuild the frontend:
```bash
cd apps/frontend
pnpm build
cd ../..
```

### Managing the Application

**View logs:**
```bash
pm2 logs asset-manager-backend
```

**Restart application:**
```bash
pm2 restart asset-manager-backend
```

**Stop application:**
```bash
pm2 stop asset-manager-backend
```

**Monitor resources:**
```bash
pm2 monit
```

### Troubleshooting on Raspberry Pi

1. **Memory issues during build:**
```bash
# Increase swap space
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile  # Set CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

2. **SQLite compilation issues:**
```bash
# Install build tools
sudo apt install build-essential python3-dev -y
pnpm rebuild better-sqlite3
```

3. **Permission issues:**
```bash
# Fix ownership
sudo chown -R pi:pi /home/pi/assetManager
```

## Database

The application uses SQLite database located at `apps/backend/asset.db`. The database is automatically created on first run with the following tables:

- **user**: Stores user authentication data
  - id (Primary Key)
  - username (Unique)
  - password (Hashed)
  - role (Default: 'user')

- **asset**: Stores asset information
  - id (Primary Key)
  - name (Required)
  - category (Optional)
  - amount (Required, Decimal)
  - note (Optional)

- **portfolio_snapshot**: Stores daily portfolio values
  - id (Primary Key)
  - totalValue (Decimal)
  - date (Timestamp)

- **audit_log**: Stores all asset change activities
  - id (Primary Key)
  - action (CREATE/UPDATE/DELETE)
  - entityType (Asset)
  - entityId (Foreign Key)
  - entityName (Asset name)
  - oldValue (JSON string)
  - newValue (JSON string)
  - timestamp (Timestamp)

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### Get Profile (Protected)
```http
GET /profile
Authorization: Bearer <jwt-token>
```

### Asset Endpoints

#### Get All Assets
```http
GET /assets
```

#### Create Asset
```http
POST /assets
Content-Type: application/json

{
  "name": "string",
  "category": "string",
  "amount": "number",
  "note": "string"
}
```

#### Update Asset
```http
PATCH /assets/:id
Content-Type: application/json

{
  "name": "string",
  "category": "string",
  "amount": "number",
  "note": "string"
}
```

#### Delete Asset
```http
DELETE /assets/:id
```

### Portfolio Endpoints

#### Get Portfolio Growth Data
```http
GET /portfolio/growth
```

#### Create Portfolio Snapshot
```http
POST /portfolio/snapshot
```

### Audit Endpoints

#### Get Audit Logs
```http
GET /audit/logs
```

## Technologies Used

### Backend
- NestJS
- TypeORM
- SQLite / better-sqlite3
- JWT (JSON Web Tokens)
- bcrypt
- Passport.js

### Frontend
- React 19
- TypeScript
- Recharts (for portfolio growth charts)
- Axios
- React Context API
- Create React App

### Development Tools
- concurrently (for running both apps)
- pnpm (backend package manager)
- npm (frontend package manager)

## Development Notes

- The backend runs on port 3000
- The frontend runs on port 3001
- CORS is configured to allow requests from the frontend
- JWT tokens are stored in localStorage
- Database synchronization is enabled in development mode
- All passwords are hashed using bcrypt# asset_manager
