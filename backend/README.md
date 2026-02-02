# 🔧 Tree Bank Backend API

Backend API server for Thailand Tree Bank LINE Mini App

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** PostgreSQL with PostGIS extension
- **Cache:** Redis
- **ORM:** Prisma
- **Authentication:** JWT + LINE ID Token

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

The `.env` file is already configured with your credentials:
- ✅ PostgreSQL connection
- ✅ Redis connection
- ⚠️ Need to add: JWT_SECRET, LINE_CHANNEL_SECRET, GEMINI_API_KEY

### 3. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Server will run on `http://localhost:8080`

---

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Authentication
```
POST /api/auth/login       - Login with LINE ID Token
GET  /api/auth/me          - Get current user
POST /api/auth/logout      - Logout
```

### Plots
```
GET    /api/plots          - Get all plots for user
GET    /api/plots/:id      - Get plot by ID
POST   /api/plots          - Create new plot
PUT    /api/plots/:id      - Update plot
DELETE /api/plots/:id      - Delete plot
```

### Trees
```
POST   /api/trees          - Add tree
POST   /api/trees/batch    - Batch add trees (offline sync)
PUT    /api/trees/:id      - Update tree
DELETE /api/trees/:id      - Delete tree
GET    /api/trees/:id/history - Get tree growth history
```

### Carbon Credits
```
GET /api/carbon/plots/:plotId - Calculate carbon credits
```

### Documents (Coming Soon)
```
POST /api/documents/upload
POST /api/documents/:id/ocr
```

### Verifications (Phase 4)
```
POST /api/verifications
GET  /api/verifications/:id
```

---

## 🔒 Authentication

All API routes (except `/health` and `/api/auth/login`) require authentication.

**Request Header:**
```
Authorization: Bearer {jwt_token}
```

**Get JWT token:**
1. Client calls `/api/auth/login` with LINE ID Token
2. Server verifies with LINE API
3. Server returns JWT token
4. Client includes token in all subsequent requests

---

## 💾 Database

### Connection

PostgreSQL with PostGIS extension:
```
postgresql://_140015aa6d48cb43:_fb59a0b931a1b7e2e5f72b0a917f0c@primary.liff-db--q4wt5c4d9mvq.addon.code.run:28996/_83707e411701?sslmode=require
```

### Prisma Commands

```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to DB (dev)
npm run db:migrate   # Run migrations (prod)
npm run db:studio    # Open Prisma Studio GUI
```

---

## 🔴 Redis Cache

### Connection

```
rediss://default:808027dc8dbb883958e01a0cd3366578@master.liff-cache--q4wt5c4d9mvq.addon.code.run:6379
```

**TLS:** Enabled
**SNI:** master.liff-cache--q4wt5c4d9mvq.addon.code.run

### Usage

- Session caching
- API response caching
- Rate limiting
- Queue management

---

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:8080/health

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"lineIdToken": "..."}'
```

---

## 🚢 Deployment

### Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT signing
- `LINE_CHANNEL_SECRET` - LINE channel secret
- `GEMINI_API_KEY` - Google Gemini API key
- `FRONTEND_URL` - Frontend URL for CORS

### Deploy to Cloud

1. Build: `npm run build`
2. Upload `dist/` folder
3. Set environment variables
4. Run: `npm start`

---

**Status:** ✅ Ready for Development
